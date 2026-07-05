export type OutputLine = { text: string; color: string };

/**
 * A small Python-ish interpreter with just enough control flow for the
 * broader lesson set: if/elif/else, for-in over range()/lists, while,
 * break/continue, functions, lists, dicts, try/except. Deliberately not a
 * real Python implementation — no classes, imports, or string methods
 * beyond str()/int()/float()/len(). Kept separate from lib/python.ts (the
 * original Variables-lesson interpreter) so extending it can't regress
 * that lesson.
 */

type Value = string | number | boolean | null | Value[] | { [k: string]: Value } | PyFunction;
type PyFunction = { __fn: true; params: string[]; body: Line[] };

type Line = { indent: number; text: string; lineNo: number };

class PyError extends Error {
  pyType: string;
  constructor(pyType: string, message: string) {
    super(message);
    this.pyType = pyType;
  }
}

class ReturnSignal {
  constructor(public value: Value) {}
}

class BreakSignal {}
class ContinueSignal {}

function tokenizeLines(src: string): Line[] {
  const lines: Line[] = [];
  src.split("\n").forEach((raw, i) => {
    const stripped = raw.replace(/#.*$/, "");
    if (!stripped.trim()) return;
    const indent = stripped.match(/^ */)?.[0].length ?? 0;
    lines.push({ indent, text: stripped.trim(), lineNo: i + 1 });
  });
  return lines;
}

/** Group flat indented lines into a tree: each entry is a line plus its nested block. */
type Block = { line: Line; children: Block[] };

function buildBlocks(lines: Line[], startIndent: number, pos: { i: number }): Block[] {
  const blocks: Block[] = [];
  while (pos.i < lines.length) {
    const line = lines[pos.i];
    if (line.indent < startIndent) break;
    if (line.indent > startIndent) throw new PyError("IndentationError", `unexpected indent (line ${line.lineNo})`);
    pos.i++;
    const children =
      pos.i < lines.length && lines[pos.i].indent > startIndent ? buildBlocks(lines, lines[pos.i].indent, pos) : [];
    blocks.push({ line, children });
  }
  return blocks;
}

/** Splits a run of concatenated bracket groups like `["a"]["b"][0]` into
 *  their inner expressions (`'"a"'`, `'"b"'`, `'0'`), respecting nested
 *  brackets and quoted strings so chained subscripts (dict-of-dicts,
 *  list-of-lists) parse correctly instead of one greedy match. */
function splitBracketChain(s: string): string[] {
  const groups: string[] = [];
  let i = 0;
  while (i < s.length) {
    if (s[i] !== "[") throw new PyError("SyntaxError", `expected '[' in subscript chain: ${s}`);
    i++;
    const start = i;
    let depth = 1;
    let q: string | null = null;
    while (i < s.length && depth > 0) {
      const ch = s[i];
      if (q) {
        if (ch === q && s[i - 1] !== "\\") q = null;
      } else if (ch === '"' || ch === "'") {
        q = ch;
      } else if (ch === "[") {
        depth++;
      } else if (ch === "]") {
        depth--;
        if (depth === 0) break;
      }
      i++;
    }
    groups.push(s.slice(start, i));
    i++; // skip the closing ']'
  }
  return groups;
}

function splitTopLevel(s: string, seps: string[]): string[] {
  const parts: string[] = [];
  let cur = "";
  let depth = 0;
  let q: string | null = null;
  let i = 0;
  while (i < s.length) {
    const ch = s[i];
    if (q) {
      cur += ch;
      if (ch === q && s[i - 1] !== "\\") q = null;
      i++;
      continue;
    }
    if (ch === '"' || ch === "'") {
      q = ch;
      cur += ch;
      i++;
      continue;
    }
    if ("([{".includes(ch)) depth++;
    if (")]}".includes(ch)) depth--;
    if (depth === 0) {
      const sep = seps.find((sp) => s.slice(i, i + sp.length) === sp);
      if (sep) {
        parts.push(cur);
        cur = "";
        i += sep.length;
        continue;
      }
    }
    cur += ch;
    i++;
  }
  parts.push(cur);
  return parts;
}

type Scope = Record<string, Value>;

function truthy(v: Value): boolean {
  if (Array.isArray(v)) return v.length > 0;
  if (v === null) return false;
  if (typeof v === "object") return Object.keys(v).length > 0;
  return Boolean(v);
}

function fmt(v: Value): string {
  if (v === null) return "None";
  if (typeof v === "boolean") return v ? "True" : "False";
  if (Array.isArray(v)) return "[" + v.map(fmtRepr).join(", ") + "]";
  if (typeof v === "object" && !("__fn" in v)) {
    return "{" + Object.entries(v).map(([k, val]) => `'${k}': ${fmtRepr(val)}`).join(", ") + "}";
  }
  return String(v);
}
function fmtRepr(v: Value): string {
  if (typeof v === "string") return `'${v}'`;
  return fmt(v);
}

class Interpreter {
  globals: Scope = {};
  out: OutputLine[] = [];

  run(src: string) {
    const lines = tokenizeLines(src);
    const blocks = buildBlocks(lines, 0, { i: 0 });
    this.execBlocks(blocks, this.globals);
  }

  execBlocks(blocks: Block[], scope: Scope) {
    for (let idx = 0; idx < blocks.length; idx++) {
      const b = blocks[idx];
      const consumed = this.execStatement(b, blocks, idx, scope);
      if (consumed) idx += consumed;
    }
  }

  /** Executes one statement (possibly an if/for/def chain); returns how many
   *  following sibling blocks were consumed as part of this statement (elif/else). */
  execStatement(b: Block, siblings: Block[], idx: number, scope: Scope): number {
    const { text, lineNo } = b.line;

    if (text.startsWith("if ") && text.endsWith(":")) {
      const cond = text.slice(3, -1);
      let consumed = 0;
      if (truthy(this.evalExpr(cond, scope, lineNo))) {
        this.execBlocks(b.children, scope);
      } else {
        // look ahead for elif/else siblings
        let handled = false;
        let j = idx + 1;
        while (j < siblings.length) {
          const nb = siblings[j];
          if (nb.line.text.startsWith("elif ") && nb.line.text.endsWith(":")) {
            consumed++;
            if (!handled && truthy(this.evalExpr(nb.line.text.slice(5, -1), scope, nb.line.lineNo))) {
              this.execBlocks(nb.children, scope);
              handled = true;
            }
            j++;
            continue;
          }
          if (nb.line.text === "else:") {
            consumed++;
            if (!handled) this.execBlocks(nb.children, scope);
            break;
          }
          break;
        }
      }
      return consumed;
    }

    if (text.startsWith("for ") && text.includes(" in ") && text.endsWith(":")) {
      const m = text.match(/^for\s+([A-Za-z_]\w*)\s+in\s+(.+):$/);
      if (!m) throw new PyError("SyntaxError", `couldn't parse for-loop (line ${lineNo})`);
      const [, varName, iterExpr] = m;
      const iterable = this.evalExpr(iterExpr, scope, lineNo);
      const items: Value[] = Array.isArray(iterable) ? iterable : [];
      for (const item of items) {
        scope[varName] = item;
        try {
          this.execBlocks(b.children, scope);
        } catch (err) {
          if (err instanceof BreakSignal) break;
          if (err instanceof ContinueSignal) continue;
          throw err;
        }
      }
      return 0;
    }

    if (text.startsWith("while ") && text.endsWith(":")) {
      const cond = text.slice(6, -1);
      let iterations = 0;
      while (truthy(this.evalExpr(cond, scope, lineNo))) {
        if (++iterations > 100000) {
          throw new PyError("RuntimeError", "loop ran for too long — check for an infinite loop (line " + lineNo + ")");
        }
        try {
          this.execBlocks(b.children, scope);
        } catch (err) {
          if (err instanceof BreakSignal) break;
          if (err instanceof ContinueSignal) continue;
          throw err;
        }
      }
      return 0;
    }

    if (text.startsWith("def ") && text.endsWith(":")) {
      const m = text.match(/^def\s+([A-Za-z_]\w*)\s*\(([^)]*)\)\s*:$/);
      if (!m) throw new PyError("SyntaxError", `couldn't parse function def (line ${lineNo})`);
      const [, name, paramStr] = m;
      const params = paramStr.trim() ? paramStr.split(",").map((p) => p.trim()) : [];
      scope[name] = { __fn: true, params, body: this.flattenBlock(b.children) } as PyFunction;
      return 0;
    }

    if (text.startsWith("try:")) {
      let consumed = 0;
      let j = idx + 1;
      const exceptBlocks: { errType: string | null; asName: string | null; children: Block[] }[] = [];
      while (j < siblings.length && siblings[j].line.text.startsWith("except")) {
        const em = siblings[j].line.text.match(/^except(?:\s+(\w+))?(?:\s+as\s+(\w+))?\s*:$/);
        exceptBlocks.push({
          errType: em?.[1] ?? null,
          asName: em?.[2] ?? null,
          children: siblings[j].children,
        });
        consumed++;
        j++;
      }
      try {
        this.execBlocks(b.children, scope);
      } catch (err) {
        if (err instanceof ReturnSignal || err instanceof BreakSignal || err instanceof ContinueSignal) throw err;
        const pe = err instanceof PyError ? err : new PyError("Exception", (err as Error).message);
        const handler = exceptBlocks.find((eb) => !eb.errType || eb.errType === pe.pyType) ?? exceptBlocks[0];
        if (!handler) throw pe;
        if (handler.asName) scope[handler.asName] = pe.message;
        this.execBlocks(handler.children, scope);
      }
      return consumed;
    }

    if (text === "else:" || text.startsWith("elif ") || text.startsWith("except")) {
      // consumed by the preceding if/try — reaching here means dangling, ignore
      return 0;
    }

    this.execSimple(text, lineNo, scope);
    return 0;
  }

  flattenBlock(children: Block[]): Line[] {
    const out: Line[] = [];
    const walk = (bs: Block[]) => {
      for (const b of bs) {
        out.push(b.line);
        walk(b.children);
      }
    };
    walk(children);
    return out;
  }

  execSimple(text: string, lineNo: number, scope: Scope) {
    let m: RegExpMatchArray | null;

    if (text === "pass") return;
    if (text === "break") throw new BreakSignal();
    if (text === "continue") throw new ContinueSignal();

    if ((m = text.match(/^return(\s+(.+))?$/))) {
      throw new ReturnSignal(m[2] ? this.evalExpr(m[2], scope, lineNo) : null);
    }

    if ((m = text.match(/^raise\s+(\w+)\((.*)\)$/))) {
      const msg = this.evalExpr(m[2], scope, lineNo);
      throw new PyError(m[1], String(msg));
    }

    if ((m = text.match(/^assert\s+(.+)$/))) {
      const parts = splitTopLevel(m[1], [","]);
      if (!truthy(this.evalExpr(parts[0], scope, lineNo))) {
        const msg = parts[1] ? String(this.evalExpr(parts[1], scope, lineNo)) : "";
        throw new PyError("AssertionError", msg);
      }
      return;
    }

    if ((m = text.match(/^print\((.*)\)$/))) {
      const argStr = m[1].trim();
      const args = argStr === "" ? [] : splitTopLevel(argStr, [","]).map((a) => this.evalExpr(a, scope, lineNo));
      this.out.push({ text: args.map(fmt).join(" "), color: "#1F2937" });
      return;
    }

    if ((m = text.match(/^([A-Za-z_]\w*)\.append\((.*)\)$/))) {
      const arr = scope[m[1]];
      if (!Array.isArray(arr)) throw new PyError("AttributeError", `'${m[1]}' has no append`);
      arr.push(this.evalExpr(m[2], scope, lineNo));
      return;
    }

    if ((m = text.match(/^([A-Za-z_]\w*(?:\[[^\]]+\])?)\s*=\s*(.+)$/))) {
      const target = m[1];
      const value = this.evalExpr(m[2], scope, lineNo);
      const idxM = target.match(/^([A-Za-z_]\w*)\[(.+)\]$/);
      if (idxM) {
        const container = scope[idxM[1]];
        const key = this.evalExpr(idxM[2], scope, lineNo);
        if (Array.isArray(container) && typeof key === "number") container[key] = value;
        else if (container && typeof container === "object") (container as Record<string, Value>)[String(key)] = value;
        else throw new PyError("TypeError", `'${idxM[1]}' is not subscriptable`);
      } else {
        scope[target] = value;
      }
      return;
    }

    // bare expression statement (e.g. a function call with no return use)
    this.evalExpr(text, scope, lineNo);
  }

  callFunction(fn: PyFunction, args: Value[], scope: Scope): Value {
    const local: Scope = Object.create(scope);
    fn.params.forEach((p, i) => (local[p] = args[i] ?? null));
    const pos = { i: 0 };
    const blocks = buildBlocks(fn.body, fn.body[0]?.indent ?? 0, pos);
    try {
      this.execBlocks(blocks, local);
    } catch (err) {
      if (err instanceof ReturnSignal) return err.value;
      throw err;
    }
    return null;
  }

  evalExpr(expr: string, scope: Scope, lineNo: number): Value {
    const e = expr.trim();

    // or / and (lowest precedence)
    let parts = splitTopLevel(e, [" or "]);
    if (parts.length > 1) return parts.some((p) => truthy(this.evalExpr(p, scope, lineNo)));
    parts = splitTopLevel(e, [" and "]);
    if (parts.length > 1) return parts.every((p) => truthy(this.evalExpr(p, scope, lineNo)));
    if (e.startsWith("not ")) return !truthy(this.evalExpr(e.slice(4), scope, lineNo));

    for (const op of ["==", "!=", "<=", ">=", "<", ">"]) {
      const sides = splitTopLevel(e, [op]);
      if (sides.length === 2) {
        const l = this.evalExpr(sides[0], scope, lineNo);
        const r = this.evalExpr(sides[1], scope, lineNo);
        switch (op) {
          case "==":
            return JSON.stringify(l) === JSON.stringify(r);
          case "!=":
            return JSON.stringify(l) !== JSON.stringify(r);
          case "<":
            return (l as number) < (r as number);
          case ">":
            return (l as number) > (r as number);
          case "<=":
            return (l as number) <= (r as number);
          case ">=":
            return (l as number) >= (r as number);
        }
      }
    }

    let m: RegExpMatchArray | null;

    const plus = splitTopLevel(e, ["+"]);
    if (plus.length > 1 && plus[0].trim() !== "") {
      return plus.map((p) => this.evalExpr(p, scope, lineNo)).reduce((a, b) => {
        if (Array.isArray(a) && Array.isArray(b)) return [...a, ...b];
        return typeof a === "string" || typeof b === "string" ? String(a) + String(b) : (a as number) + (b as number);
      });
    }
    const minus = splitTopLevel(e, ["-"]);
    if (minus.length > 1 && minus[0].trim() !== "") {
      return minus.map((p) => this.evalExpr(p, scope, lineNo)).reduce((a, b) => (a as number) - (b as number));
    }
    const mulDiv = splitTopLevel(e, ["*", "//", "%", "/"]);
    if (mulDiv.length > 1) {
      // splitTopLevel doesn't tell us which operator matched at each split;
      // re-scan manually for correctness with mixed * / // %.
      return this.evalMulChain(e, scope, lineNo);
    }

    if ((m = e.match(/^f(["'])([\s\S]*)\1$/))) {
      return m[2].replace(/\{([^}]+)\}/g, (_, v) => fmt(this.evalExpr(v, scope, lineNo)));
    }
    if ((m = e.match(/^(["'])([\s\S]*)\1$/))) return m[2];
    if (/^-?\d+\.\d+$/.test(e)) return Number(e);
    if (/^-?\d+$/.test(e)) return Number(e);
    if (e === "True") return true;
    if (e === "False") return false;
    if (e === "None") return null;

    if (e.startsWith("[") && e.endsWith("]")) {
      const inner = e.slice(1, -1).trim();
      if (!inner) return [];
      return splitTopLevel(inner, [","]).map((p) => this.evalExpr(p, scope, lineNo));
    }
    if (e.startsWith("{") && e.endsWith("}")) {
      const inner = e.slice(1, -1).trim();
      const obj: Record<string, Value> = {};
      if (inner) {
        for (const pair of splitTopLevel(inner, [","])) {
          const [k, v] = splitTopLevel(pair, [":"]);
          const key = this.evalExpr(k, scope, lineNo);
          obj[String(key)] = this.evalExpr(v, scope, lineNo);
        }
      }
      return obj;
    }

    if ((m = e.match(/^([A-Za-z_]\w*)((?:\[[\s\S]+\])+)$/))) {
      let container = this.evalExpr(m[1], scope, lineNo);
      for (const keyExpr of splitBracketChain(m[2])) {
        const key = this.evalExpr(keyExpr, scope, lineNo);
        if (Array.isArray(container)) {
          const i = key as number;
          const v = container[i < 0 ? container.length + i : i];
          if (v === undefined) throw new PyError("IndexError", "list index out of range");
          container = v;
        } else if (container && typeof container === "object") {
          const v = (container as Record<string, Value>)[String(key)];
          if (v === undefined) throw new PyError("KeyError", String(key));
          container = v;
        } else {
          throw new PyError("TypeError", "not subscriptable");
        }
      }
      return container;
    }

    if ((m = e.match(/^str\((.+)\)$/))) return fmt(this.evalExpr(m[1], scope, lineNo));
    if ((m = e.match(/^int\((.+)\)$/))) return parseInt(String(this.evalExpr(m[1], scope, lineNo)), 10);
    if ((m = e.match(/^float\((.+)\)$/))) return parseFloat(String(this.evalExpr(m[1], scope, lineNo)));
    if ((m = e.match(/^len\((.+)\)$/))) {
      const v = this.evalExpr(m[1], scope, lineNo);
      if (Array.isArray(v) || typeof v === "string") return v.length;
      if (v && typeof v === "object") return Object.keys(v).length;
      throw new PyError("TypeError", "object has no len()");
    }
    if ((m = e.match(/^range\((.+)\)$/))) {
      const args = splitTopLevel(m[1], [","]).map((a) => this.evalExpr(a, scope, lineNo) as number);
      const [start, stop, step] = args.length === 1 ? [0, args[0], 1] : args.length === 2 ? [args[0], args[1], 1] : args;
      const arr: number[] = [];
      for (let v = start; step > 0 ? v < stop : v > stop; v += step) arr.push(v);
      return arr;
    }

    if ((m = e.match(/^([A-Za-z_]\w*)\((.*)\)$/))) {
      const fn = scope[m[1]];
      if (!fn || typeof fn !== "object" || !("__fn" in fn)) throw new PyError("NameError", `name '${m[1]}' is not defined`);
      const argStr = m[2].trim();
      const args = argStr === "" ? [] : splitTopLevel(argStr, [","]).map((a) => this.evalExpr(a, scope, lineNo));
      return this.callFunction(fn as PyFunction, args, scope);
    }

    if (/^[A-Za-z_]\w*$/.test(e)) {
      if (e in scope) return scope[e];
      throw new PyError("NameError", `name '${e}' is not defined`);
    }

    throw new PyError("SyntaxError", `couldn't understand: ${e} (line ${lineNo})`);
  }

  evalMulChain(e: string, scope: Scope, lineNo: number): Value {
    // Left-to-right scan honoring *, /, //, % at top level (same precedence).
    let i = 0;
    let depth = 0;
    let q: string | null = null;
    const tokens: string[] = [];
    const ops: string[] = [];
    let cur = "";
    while (i < e.length) {
      const ch = e[i];
      if (q) {
        cur += ch;
        if (ch === q) q = null;
        i++;
        continue;
      }
      if (ch === '"' || ch === "'") {
        q = ch;
        cur += ch;
        i++;
        continue;
      }
      if ("([{".includes(ch)) depth++;
      if (")]}".includes(ch)) depth--;
      if (depth === 0 && e.slice(i, i + 2) === "//") {
        tokens.push(cur);
        cur = "";
        ops.push("//");
        i += 2;
        continue;
      }
      if (depth === 0 && (ch === "*" || ch === "/" || ch === "%")) {
        tokens.push(cur);
        cur = "";
        ops.push(ch);
        i++;
        continue;
      }
      cur += ch;
      i++;
    }
    tokens.push(cur);
    let acc = this.evalExpr(tokens[0], scope, lineNo) as number;
    for (let k = 0; k < ops.length; k++) {
      const rhs = this.evalExpr(tokens[k + 1], scope, lineNo) as number;
      if (ops[k] === "*") acc = acc * rhs;
      else if (ops[k] === "/") {
        if (rhs === 0) throw new PyError("ZeroDivisionError", "division by zero");
        acc = acc / rhs;
      } else if (ops[k] === "//") {
        if (rhs === 0) throw new PyError("ZeroDivisionError", "division by zero");
        acc = Math.floor(acc / rhs);
      } else if (ops[k] === "%") {
        if (rhs === 0) throw new PyError("ZeroDivisionError", "division by zero");
        acc = acc % rhs;
      }
    }
    return acc;
  }
}

export function runPythonExt(src: string): OutputLine[] {
  const interp = new Interpreter();
  try {
    interp.run(src);
    if (!interp.out.length) interp.out.push({ text: "(no output — did you call print()?)", color: "#6B7280" });
  } catch (err) {
    if (err instanceof ReturnSignal) {
      // top-level return, ignore
    } else if (err instanceof BreakSignal || err instanceof ContinueSignal) {
      interp.out.push({ text: "SyntaxError: 'break'/'continue' outside loop", color: "#DC2626" });
    } else {
      const msg = err instanceof PyError ? `${err.pyType}: ${err.message}` : (err as Error).message;
      interp.out.push({ text: msg, color: "#DC2626" });
    }
  }
  return interp.out;
}
