import type { OutputLine } from "./python";

/**
 * A small real JavaScript interpreter — tokenizer, recursive-descent parser,
 * tree-walking evaluator — covering enough of the language for the Phase 2
 * lessons (modules 5-7) to run actual student-written JS instead of a Python
 * simulation of it. Supports: let/const/var, arithmetic + template literals,
 * if/else, for (classic + for-of), while, break/continue, function
 * declarations + arrow functions + closures, arrays/objects with the common
 * methods (map/filter/forEach/push/join/includes/slice), Object.keys/values/
 * entries, JSON.stringify/parse, Math.*, console.log, and a synchronous mock
 * fetch()/Promise/.then()/async-await good enough to teach the real syntax
 * (there's no real network in a lesson sandbox, so "async" work resolves
 * immediately rather than modeling a microtask queue). Deliberately not a
 * real JS engine — no classes, no generators, no regex literals.
 */

// ---------- Tokenizer ----------

type TokenType =
  | "num" | "str" | "template" | "ident" | "punct" | "eof";

type Token = { type: TokenType; value: string; parts?: TemplatePart[]; line: number };
type TemplatePart = { text: string } | { expr: string };

const KEYWORDS = new Set([
  "let", "const", "var", "function", "return", "if", "else", "for", "while",
  "break", "continue", "true", "false", "null", "undefined", "of", "in",
  "async", "await", "new", "typeof",
]);

class JsError extends Error {
  jsName: string;
  constructor(jsName: string, message: string) {
    super(message);
    this.jsName = jsName;
  }
}

function tokenize(src: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  let line = 1;
  const n = src.length;

  function isIdentStart(ch: string) {
    return /[A-Za-z_$]/.test(ch);
  }
  function isIdentPart(ch: string) {
    return /[A-Za-z0-9_$]/.test(ch);
  }

  while (i < n) {
    const ch = src[i];

    if (ch === "\n") {
      line++;
      i++;
      continue;
    }
    if (/\s/.test(ch)) {
      i++;
      continue;
    }
    if (ch === "/" && src[i + 1] === "/") {
      while (i < n && src[i] !== "\n") i++;
      continue;
    }
    if (ch === "/" && src[i + 1] === "*") {
      i += 2;
      while (i < n && !(src[i] === "*" && src[i + 1] === "/")) {
        if (src[i] === "\n") line++;
        i++;
      }
      i += 2;
      continue;
    }

    if (/[0-9]/.test(ch) || (ch === "." && /[0-9]/.test(src[i + 1]))) {
      let j = i;
      while (j < n && /[0-9.]/.test(src[j])) j++;
      tokens.push({ type: "num", value: src.slice(i, j), line });
      i = j;
      continue;
    }

    if (ch === '"' || ch === "'") {
      const quote = ch;
      let j = i + 1;
      let out = "";
      while (j < n && src[j] !== quote) {
        if (src[j] === "\\") {
          const next = src[j + 1];
          out += next === "n" ? "\n" : next === "t" ? "\t" : next;
          j += 2;
          continue;
        }
        out += src[j];
        j++;
      }
      tokens.push({ type: "str", value: out, line });
      i = j + 1;
      continue;
    }

    if (ch === "`") {
      let j = i + 1;
      const parts: TemplatePart[] = [];
      let cur = "";
      while (j < n && src[j] !== "`") {
        if (src[j] === "\\") {
          cur += src[j + 1];
          j += 2;
          continue;
        }
        if (src[j] === "$" && src[j + 1] === "{") {
          parts.push({ text: cur });
          cur = "";
          j += 2;
          let depth = 1;
          let expr = "";
          while (j < n && depth > 0) {
            if (src[j] === "{") depth++;
            if (src[j] === "}") {
              depth--;
              if (depth === 0) break;
            }
            expr += src[j];
            j++;
          }
          parts.push({ expr });
          j++;
          continue;
        }
        if (src[j] === "\n") line++;
        cur += src[j];
        j++;
      }
      parts.push({ text: cur });
      tokens.push({ type: "template", value: "", parts, line });
      i = j + 1;
      continue;
    }

    if (isIdentStart(ch)) {
      let j = i;
      while (j < n && isIdentPart(src[j])) j++;
      tokens.push({ type: "ident", value: src.slice(i, j), line });
      i = j;
      continue;
    }

    const three = src.slice(i, i + 3);
    if (["===", "!==", "**="].includes(three)) {
      tokens.push({ type: "punct", value: three, line });
      i += 3;
      continue;
    }
    const two = src.slice(i, i + 2);
    if (["==", "!=", "<=", ">=", "&&", "||", "=>", "++", "--", "+=", "-=", "*=", "/=", "**"].includes(two)) {
      tokens.push({ type: "punct", value: two, line });
      i += 2;
      continue;
    }
    if ("+-*/%<>=!(){}[],.;:?&|".includes(ch)) {
      tokens.push({ type: "punct", value: ch, line });
      i++;
      continue;
    }

    throw new JsError("SyntaxError", `unexpected character '${ch}' (line ${line})`);
  }

  tokens.push({ type: "eof", value: "", line });
  return tokens;
}

// ---------- AST ----------

type Node = { type: string; [k: string]: unknown };

// ---------- Parser ----------

class Parser {
  tokens: Token[];
  pos = 0;

  constructor(tokens: Token[]) {
    this.tokens = tokens;
  }

  peek(offset = 0): Token {
    return this.tokens[this.pos + offset];
  }

  next(): Token {
    return this.tokens[this.pos++];
  }

  at(type: TokenType, value?: string): boolean {
    const t = this.peek();
    return t.type === type && (value === undefined || t.value === value);
  }

  expectPunct(value: string): Token {
    if (!this.at("punct", value)) {
      throw new JsError("SyntaxError", `expected '${value}' but got '${this.peek().value}' (line ${this.peek().line})`);
    }
    return this.next();
  }

  parseProgram(): Node {
    const body: Node[] = [];
    while (!this.at("eof")) body.push(this.parseStatement());
    return { type: "Program", body };
  }

  parseBlock(): Node {
    this.expectPunct("{");
    const body: Node[] = [];
    while (!this.at("punct", "}")) body.push(this.parseStatement());
    this.expectPunct("}");
    return { type: "Block", body };
  }

  skipSemi() {
    while (this.at("punct", ";")) this.next();
  }

  parseStatement(): Node {
    const t = this.peek();

    if (t.type === "ident" && (t.value === "let" || t.value === "const" || t.value === "var")) {
      this.next();
      const declarations: { name: string; init: Node | null }[] = [];
      for (;;) {
        const name = this.next().value;
        let init: Node | null = null;
        if (this.at("punct", "=")) {
          this.next();
          init = this.parseAssign();
        }
        declarations.push({ name, init });
        if (this.at("punct", ",")) {
          this.next();
          continue;
        }
        break;
      }
      this.skipSemi();
      return { type: "VarDecl", declarations };
    }

    if (t.type === "ident" && t.value === "function") return this.parseFunctionDecl();
    if (t.type === "ident" && t.value === "async" && this.peek(1).value === "function") {
      this.next();
      return this.parseFunctionDecl();
    }

    if (t.type === "ident" && t.value === "return") {
      this.next();
      let arg: Node | null = null;
      if (!this.at("punct", ";") && !this.at("punct", "}")) arg = this.parseAssign();
      this.skipSemi();
      return { type: "Return", argument: arg };
    }

    if (t.type === "ident" && t.value === "break") {
      this.next();
      this.skipSemi();
      return { type: "Break" };
    }
    if (t.type === "ident" && t.value === "continue") {
      this.next();
      this.skipSemi();
      return { type: "Continue" };
    }

    if (t.type === "ident" && t.value === "if") return this.parseIf();
    if (t.type === "ident" && t.value === "for") return this.parseFor();
    if (t.type === "ident" && t.value === "while") return this.parseWhile();
    if (t.type === "ident" && t.value === "try") return this.parseTry();
    if (t.type === "ident" && t.value === "throw") {
      this.next();
      const argument = this.parseAssign();
      this.skipSemi();
      return { type: "Throw", argument };
    }

    if (this.at("punct", "{")) return this.parseBlock();
    if (this.at("punct", ";")) {
      this.next();
      return { type: "Empty" };
    }

    const expr = this.parseAssign();
    this.skipSemi();
    return { type: "ExprStmt", expression: expr };
  }

  parseFunctionDecl(): Node {
    this.next(); // 'function'
    const name = this.next().value;
    const params = this.parseParamList();
    const body = this.parseBlock();
    return { type: "FunctionDecl", name, params, body };
  }

  parseParamList(): string[] {
    this.expectPunct("(");
    const params: string[] = [];
    while (!this.at("punct", ")")) {
      params.push(this.next().value);
      if (this.at("punct", ",")) this.next();
    }
    this.expectPunct(")");
    return params;
  }

  parseIf(): Node {
    this.next();
    this.expectPunct("(");
    const test = this.parseAssign();
    this.expectPunct(")");
    const consequent = this.parseStatement();
    let alternate: Node | null = null;
    if (this.at("ident", "else")) {
      this.next();
      alternate = this.at("ident", "if") ? this.parseIf() : this.parseStatement();
    }
    return { type: "If", test, consequent, alternate };
  }

  parseFor(): Node {
    this.next();
    this.expectPunct("(");

    // for (const x of iterable)
    if ((this.at("ident", "let") || this.at("ident", "const") || this.at("ident", "var")) &&
      this.peek(2).value === "of") {
      this.next();
      const varName = this.next().value;
      this.next(); // 'of'
      const iterable = this.parseAssign();
      this.expectPunct(")");
      const body = this.parseStatement();
      return { type: "ForOf", varName, iterable, body };
    }

    let init: Node | null = null;
    if (!this.at("punct", ";")) {
      if (this.at("ident", "let") || this.at("ident", "const") || this.at("ident", "var")) {
        this.next();
        const name = this.next().value;
        let initExpr: Node | null = null;
        if (this.at("punct", "=")) {
          this.next();
          initExpr = this.parseAssign();
        }
        init = { type: "VarDecl", declarations: [{ name, init: initExpr }] };
      } else {
        init = { type: "ExprStmt", expression: this.parseAssign() };
      }
    }
    this.expectPunct(";");
    let test: Node | null = null;
    if (!this.at("punct", ";")) test = this.parseAssign();
    this.expectPunct(";");
    let update: Node | null = null;
    if (!this.at("punct", ")")) update = this.parseAssign();
    this.expectPunct(")");
    const body = this.parseStatement();
    return { type: "For", init, test, update, body };
  }

  parseWhile(): Node {
    this.next();
    this.expectPunct("(");
    const test = this.parseAssign();
    this.expectPunct(")");
    const body = this.parseStatement();
    return { type: "While", test, body };
  }

  parseTry(): Node {
    this.next(); // 'try'
    const block = this.parseBlock();
    let handlerParam: string | null = null;
    let handlerBody: Node | null = null;
    if (this.at("ident", "catch")) {
      this.next();
      if (this.at("punct", "(")) {
        this.next();
        handlerParam = this.next().value;
        this.expectPunct(")");
      }
      handlerBody = this.parseBlock();
    }
    let finalizer: Node | null = null;
    if (this.at("ident", "finally")) {
      this.next();
      finalizer = this.parseBlock();
    }
    return { type: "Try", block, handlerParam, handlerBody, finalizer };
  }

  // Expression parsing, precedence climbing.
  parseAssign(): Node {
    const left = this.parseConditional();
    if (this.at("punct") && ["=", "+=", "-=", "*=", "/="].includes(this.peek().value)) {
      const op = this.next().value;
      const right = this.parseAssign();
      return { type: "Assign", operator: op, left, right };
    }
    return left;
  }

  parseConditional(): Node {
    const test = this.parseLogicalOr();
    if (this.at("punct", "?")) {
      this.next();
      const consequent = this.parseAssign();
      this.expectPunct(":");
      const alternate = this.parseAssign();
      return { type: "Conditional", test, consequent, alternate };
    }
    return test;
  }

  parseLogicalOr(): Node {
    let left = this.parseLogicalAnd();
    while (this.at("punct", "||")) {
      this.next();
      const right = this.parseLogicalAnd();
      left = { type: "Logical", operator: "||", left, right };
    }
    return left;
  }

  parseLogicalAnd(): Node {
    let left = this.parseEquality();
    while (this.at("punct", "&&")) {
      this.next();
      const right = this.parseEquality();
      left = { type: "Logical", operator: "&&", left, right };
    }
    return left;
  }

  parseEquality(): Node {
    let left = this.parseRelational();
    while (this.at("punct") && ["===", "!==", "==", "!="].includes(this.peek().value)) {
      const op = this.next().value;
      const right = this.parseRelational();
      left = { type: "Binary", operator: op, left, right };
    }
    return left;
  }

  parseRelational(): Node {
    let left = this.parseAdditive();
    while (this.at("punct") && ["<", ">", "<=", ">="].includes(this.peek().value)) {
      const op = this.next().value;
      const right = this.parseAdditive();
      left = { type: "Binary", operator: op, left, right };
    }
    return left;
  }

  parseAdditive(): Node {
    let left = this.parseMultiplicative();
    while (this.at("punct") && ["+", "-"].includes(this.peek().value)) {
      const op = this.next().value;
      const right = this.parseMultiplicative();
      left = { type: "Binary", operator: op, left, right };
    }
    return left;
  }

  parseMultiplicative(): Node {
    let left = this.parseUnary();
    while (this.at("punct") && ["*", "/", "%"].includes(this.peek().value)) {
      const op = this.next().value;
      const right = this.parseUnary();
      left = { type: "Binary", operator: op, left, right };
    }
    return left;
  }

  parseUnary(): Node {
    if (this.at("punct") && ["!", "-", "+"].includes(this.peek().value)) {
      const op = this.next().value;
      const argument = this.parseUnary();
      return { type: "Unary", operator: op, argument };
    }
    if (this.at("punct") && ["++", "--"].includes(this.peek().value)) {
      const op = this.next().value;
      const argument = this.parseUnary();
      return { type: "Update", operator: op, argument, prefix: true };
    }
    if (this.at("ident", "typeof")) {
      this.next();
      const argument = this.parseUnary();
      return { type: "Typeof", argument };
    }
    if (this.at("ident", "await")) {
      this.next();
      const argument = this.parseUnary();
      return { type: "Await", argument };
    }
    return this.parsePostfix();
  }

  parsePostfix(): Node {
    let node = this.parseCallMember();
    if (this.at("punct") && ["++", "--"].includes(this.peek().value)) {
      const op = this.next().value;
      node = { type: "Update", operator: op, argument: node, prefix: false };
    }
    return node;
  }

  parseCallMember(): Node {
    let node = this.parsePrimary();
    for (;;) {
      if (this.at("punct", ".")) {
        this.next();
        const prop = this.next().value;
        node = { type: "Member", object: node, property: { type: "Literal", value: prop }, computed: false };
      } else if (this.at("punct", "[")) {
        this.next();
        const prop = this.parseAssign();
        this.expectPunct("]");
        node = { type: "Member", object: node, property: prop, computed: true };
      } else if (this.at("punct", "(")) {
        const args = this.parseArgs();
        node = { type: "Call", callee: node, arguments: args };
      } else {
        break;
      }
    }
    return node;
  }

  parseArgs(): Node[] {
    this.expectPunct("(");
    const args: Node[] = [];
    while (!this.at("punct", ")")) {
      args.push(this.parseAssign());
      if (this.at("punct", ",")) this.next();
    }
    this.expectPunct(")");
    return args;
  }

  /** Looks ahead to see if `(...)` forms an arrow function's param list (`(...) =>`). */
  tryParseArrowParams(): string[] | null {
    const save = this.pos;
    try {
      let params: string[];
      if (this.at("ident") && this.peek(1).value === "=>") {
        params = [this.next().value];
      } else if (this.at("punct", "(")) {
        params = this.parseParamList();
      } else {
        this.pos = save;
        return null;
      }
      if (this.at("punct", "=>")) return params;
      this.pos = save;
      return null;
    } catch {
      this.pos = save;
      return null;
    }
  }

  parsePrimary(): Node {
    // Arrow function?
    const arrowParams = this.tryParseArrowParams();
    if (arrowParams) {
      this.expectPunct("=>");
      let body: Node;
      let expression = true;
      if (this.at("punct", "{")) {
        body = this.parseBlock();
        expression = false;
      } else {
        body = this.parseAssign();
      }
      return { type: "Arrow", params: arrowParams, body, expression };
    }

    const t = this.peek();

    if (t.type === "num") {
      this.next();
      return { type: "Literal", value: Number(t.value) };
    }
    if (t.type === "str") {
      this.next();
      return { type: "Literal", value: t.value };
    }
    if (t.type === "template") {
      this.next();
      return { type: "Template", parts: t.parts };
    }
    if (t.type === "ident" && t.value === "true") {
      this.next();
      return { type: "Literal", value: true };
    }
    if (t.type === "ident" && t.value === "false") {
      this.next();
      return { type: "Literal", value: false };
    }
    if (t.type === "ident" && t.value === "null") {
      this.next();
      return { type: "Literal", value: null };
    }
    if (t.type === "ident" && t.value === "undefined") {
      this.next();
      return { type: "Literal", value: undefined };
    }
    if (t.type === "ident" && t.value === "function") {
      this.next();
      const params = this.parseParamList();
      const body = this.parseBlock();
      return { type: "FunctionExpr", params, body };
    }
    if (t.type === "ident" && t.value === "async") {
      this.next();
      return this.parsePrimary();
    }
    if (t.type === "ident" && t.value === "new") {
      this.next();
      const callee = this.parseCallMember();
      return callee;
    }

    if (t.type === "ident") {
      this.next();
      return { type: "Identifier", name: t.value };
    }

    if (this.at("punct", "(")) {
      this.next();
      const expr = this.parseAssign();
      this.expectPunct(")");
      return expr;
    }

    if (this.at("punct", "[")) {
      this.next();
      const elements: Node[] = [];
      while (!this.at("punct", "]")) {
        elements.push(this.parseAssign());
        if (this.at("punct", ",")) this.next();
      }
      this.expectPunct("]");
      return { type: "ArrayLit", elements };
    }

    if (this.at("punct", "{")) {
      this.next();
      const properties: { key: string; value: Node; computed: boolean }[] = [];
      while (!this.at("punct", "}")) {
        let key: string;
        let computed = false;
        if (this.at("punct", "[")) {
          this.next();
          const keyExpr = this.parseAssign();
          this.expectPunct("]");
          properties.push({ key: "", value: keyExpr, computed: true });
          this.expectPunct(":");
          const val = this.parseAssign();
          properties[properties.length - 1] = { key: "", value: { type: "PropPair", keyExpr, value: val }, computed: true };
          if (this.at("punct", ",")) this.next();
          continue;
        } else {
          key = this.next().value;
        }
        if (this.at("punct", ":")) {
          this.next();
          const val = this.parseAssign();
          properties.push({ key, value: val, computed });
        } else if (this.at("punct", "(")) {
          // shorthand method: name(params) { ... }
          const params = this.parseParamList();
          const body = this.parseBlock();
          properties.push({ key, value: { type: "FunctionExpr", params, body }, computed: false });
        } else {
          // shorthand: { x } means { x: x }
          properties.push({ key, value: { type: "Identifier", name: key }, computed: false });
        }
        if (this.at("punct", ",")) this.next();
      }
      this.expectPunct("}");
      return { type: "ObjectLit", properties };
    }

    throw new JsError("SyntaxError", `unexpected token '${t.value}' (line ${t.line})`);
  }
}

// ---------- Values & environment ----------

type JsValue =
  | number | string | boolean | null | undefined
  | JsValue[]
  | { [k: string]: JsValue }
  | JsFunction
  | JsPromise;

type JsFunction = { __jsfn: true; params: string[]; body: Node; closure: Env; isExpr: boolean; name?: string };
type JsPromise = { __promise: true; value: JsValue };

class Env {
  vars = new Map<string, JsValue>();
  parent: Env | null;
  constructor(parent: Env | null = null) {
    this.parent = parent;
  }
  get(name: string): JsValue {
    let env: Env | null = this;
    while (env) {
      if (env.vars.has(name)) return env.vars.get(name) as JsValue;
      env = env.parent;
    }
    throw new JsError("ReferenceError", `${name} is not defined`);
  }
  set(name: string, value: JsValue) {
    let env: Env | null = this;
    while (env) {
      if (env.vars.has(name)) {
        env.vars.set(name, value);
        return;
      }
      env = env.parent;
    }
    // implicit global assignment (sloppy mode) — declare here
    this.vars.set(name, value);
  }
  declare(name: string, value: JsValue) {
    this.vars.set(name, value);
  }
}

class ReturnSignal {
  constructor(public value: JsValue) {}
}
class BreakSignal {}
class ContinueSignal {}
class ThrowSignal {
  constructor(public value: JsValue) {}
}

function isPromise(v: unknown): v is JsPromise {
  return !!v && typeof v === "object" && "__promise" in (v as object);
}
function isFn(v: unknown): v is JsFunction {
  return !!v && typeof v === "object" && "__jsfn" in (v as object);
}

function truthy(v: JsValue): boolean {
  if (Array.isArray(v)) return true;
  return Boolean(v);
}

function jsTypeof(v: JsValue): string {
  if (v === undefined) return "undefined";
  if (v === null) return "object";
  if (typeof v === "boolean") return "boolean";
  if (typeof v === "number") return "number";
  if (typeof v === "string") return "string";
  if (isFn(v)) return "function";
  return "object";
}

function displayValue(v: JsValue): string {
  if (v === undefined) return "undefined";
  if (v === null) return "null";
  if (typeof v === "string") return v;
  if (typeof v === "number" || typeof v === "boolean") return String(v);
  if (Array.isArray(v)) return "[ " + v.map(inspectValue).join(", ") + " ]";
  if (isFn(v)) return `[Function: ${v.name || "anonymous"}]`;
  if (isPromise(v)) return `Promise { ${inspectValue(v.value)} }`;
  if (typeof v === "object" && "name" in v && "message" in v && Object.keys(v).length === 2) {
    return `${(v as Record<string, JsValue>).name}: ${(v as Record<string, JsValue>).message}`;
  }
  return inspectObject(v as Record<string, JsValue>);
}
function inspectValue(v: JsValue): string {
  if (typeof v === "string") return `'${v}'`;
  if (Array.isArray(v)) return "[ " + v.map(inspectValue).join(", ") + " ]";
  if (v && typeof v === "object" && !isFn(v) && !isPromise(v)) return inspectObject(v as Record<string, JsValue>);
  return displayValue(v);
}
function inspectObject(obj: Record<string, JsValue>): string {
  const entries = Object.entries(obj).map(([k, v]) => `${k}: ${inspectValue(v)}`);
  return "{ " + entries.join(", ") + " }";
}

// ---------- Interpreter ----------

class Interpreter {
  out: OutputLine[] = [];
  global = new Env();

  constructor() {
    this.installBuiltins();
  }

  installBuiltins() {
    const g = this.global;
    g.declare("console", {
      log: this.nativeFn("log", (...args: JsValue[]) => {
        this.out.push({ text: args.map(displayValue).join(" "), color: "#1F2937" });
        return undefined;
      }),
    } as unknown as JsValue);

    g.declare("Math", {
      floor: this.nativeFn("floor", (x: JsValue) => Math.floor(x as number)),
      ceil: this.nativeFn("ceil", (x: JsValue) => Math.ceil(x as number)),
      round: this.nativeFn("round", (x: JsValue) => Math.round(x as number)),
      max: this.nativeFn("max", (...xs: JsValue[]) => Math.max(...(xs as number[]))),
      min: this.nativeFn("min", (...xs: JsValue[]) => Math.min(...(xs as number[]))),
      abs: this.nativeFn("abs", (x: JsValue) => Math.abs(x as number)),
      random: this.nativeFn("random", () => 0.5),
      pow: this.nativeFn("pow", (a: JsValue, b: JsValue) => Math.pow(a as number, b as number)),
    } as unknown as JsValue);

    g.declare("Object", {
      keys: this.nativeFn("keys", (o: JsValue) => Object.keys(o as object)),
      values: this.nativeFn("values", (o: JsValue) => Object.values(o as object) as JsValue[]),
      entries: this.nativeFn(
        "entries",
        (o: JsValue) => Object.entries(o as object).map(([k, v]) => [k, v]) as unknown as JsValue,
      ),
    } as unknown as JsValue);

    g.declare("JSON", {
      stringify: this.nativeFn("stringify", (v: JsValue) => jsonStringify(v)),
      parse: this.nativeFn("parse", (s: JsValue) => JSON.parse(s as string)),
    } as unknown as JsValue);

    g.declare(
      "Error",
      this.nativeFn("Error", (message?: JsValue) => ({ name: "Error", message: message ?? "" }) as unknown as JsValue),
    );

    // A synchronous mock fetch: no real network, resolves instantly to a
    // Response-like object whose body is whatever JSON-able data was passed
    // as the (optional) second "mock" argument the lesson supplies.
    g.declare(
      "fetch",
      this.nativeFn("fetch", (url: JsValue, mockData?: JsValue) => {
        const body = mockData ?? { url };
        const response = {
          ok: true,
          status: 200,
          json: this.nativeFn("json", () => wrapPromise(body)),
        } as unknown as JsValue;
        return wrapPromise(response);
      }),
    );
  }

  nativeFn(name: string, fn: (...args: JsValue[]) => JsValue): JsFunction {
    return {
      __jsfn: true,
      params: [],
      body: { type: "Native", fn } as unknown as Node,
      closure: this.global,
      isExpr: true,
      name,
    };
  }

  run(src: string): OutputLine[] {
    try {
      const tokens = tokenize(src);
      const program = new Parser(tokens).parseProgram();
      this.execBlockBody((program.body as Node[]), this.global);
      if (!this.out.length) this.out.push({ text: "(no output — did you call console.log()?)", color: "#6B7280" });
    } catch (err) {
      if (err instanceof ReturnSignal || err instanceof BreakSignal || err instanceof ContinueSignal) {
        // top-level control-flow escape, ignore
      } else if (err instanceof ThrowSignal) {
        const v = err.value;
        const msg =
          v && typeof v === "object" && !Array.isArray(v) && "message" in (v as object)
            ? `Uncaught ${(v as Record<string, JsValue>).name ?? "Error"}: ${(v as Record<string, JsValue>).message}`
            : `Uncaught: ${displayValue(v)}`;
        this.out.push({ text: msg, color: "#DC2626" });
      } else {
        const msg = err instanceof JsError ? `${err.jsName}: ${err.message}` : (err as Error).message;
        this.out.push({ text: msg, color: "#DC2626" });
      }
    }
    return this.out;
  }

  execBlockBody(body: Node[], env: Env) {
    // Hoist function declarations so they can be called before their
    // textual position, matching real JS function-declaration semantics.
    for (const stmt of body) {
      if (stmt.type === "FunctionDecl") {
        env.declare(stmt.name as string, {
          __jsfn: true,
          params: stmt.params as string[],
          body: stmt.body as Node,
          closure: env,
          isExpr: false,
          name: stmt.name as string,
        });
      }
    }
    for (const stmt of body) {
      if (stmt.type !== "FunctionDecl") this.execStatement(stmt, env);
    }
  }

  execStatement(node: Node, env: Env) {
    switch (node.type) {
      case "VarDecl": {
        for (const d of node.declarations as { name: string; init: Node | null }[]) {
          env.declare(d.name, d.init ? this.evalExpr(d.init, env) : undefined);
        }
        return;
      }
      case "ExprStmt":
        this.evalExpr(node.expression as Node, env);
        return;
      case "Block": {
        const blockEnv = new Env(env);
        this.execBlockBody(node.body as Node[], blockEnv);
        return;
      }
      case "Empty":
        return;
      case "If": {
        if (truthy(this.evalExpr(node.test as Node, env))) {
          this.execStatement(node.consequent as Node, env);
        } else if (node.alternate) {
          this.execStatement(node.alternate as Node, env);
        }
        return;
      }
      case "While": {
        let iterations = 0;
        while (truthy(this.evalExpr(node.test as Node, env))) {
          if (++iterations > 100000) throw new JsError("RangeError", "loop ran for too long — check for an infinite loop");
          try {
            this.execStatement(node.body as Node, new Env(env));
          } catch (err) {
            if (err instanceof BreakSignal) break;
            if (err instanceof ContinueSignal) continue;
            throw err;
          }
        }
        return;
      }
      case "For": {
        const forEnv = new Env(env);
        if (node.init) this.execStatement(node.init as Node, forEnv);
        let iterations = 0;
        while (node.test ? truthy(this.evalExpr(node.test as Node, forEnv)) : true) {
          if (++iterations > 100000) throw new JsError("RangeError", "loop ran for too long — check for an infinite loop");
          try {
            this.execStatement(node.body as Node, new Env(forEnv));
          } catch (err) {
            if (err instanceof BreakSignal) break;
            if (!(err instanceof ContinueSignal)) throw err;
          }
          if (node.update) this.evalExpr(node.update as Node, forEnv);
        }
        return;
      }
      case "ForOf": {
        const iterable = this.evalExpr(node.iterable as Node, env);
        const items: JsValue[] = Array.isArray(iterable)
          ? iterable
          : typeof iterable === "string"
            ? iterable.split("")
            : [];
        for (const item of items) {
          const loopEnv = new Env(env);
          loopEnv.declare(node.varName as string, item);
          try {
            this.execStatement(node.body as Node, loopEnv);
          } catch (err) {
            if (err instanceof BreakSignal) break;
            if (err instanceof ContinueSignal) continue;
            throw err;
          }
        }
        return;
      }
      case "FunctionDecl":
        return; // already hoisted
      case "Return":
        throw new ReturnSignal(node.argument ? this.evalExpr(node.argument as Node, env) : undefined);
      case "Break":
        throw new BreakSignal();
      case "Continue":
        throw new ContinueSignal();
      case "Throw":
        throw new ThrowSignal(this.evalExpr(node.argument as Node, env));
      case "Try": {
        try {
          try {
            this.execStatement(node.block as Node, new Env(env));
          } catch (err) {
            if (err instanceof ReturnSignal || err instanceof BreakSignal || err instanceof ContinueSignal) throw err;
            if (!node.handlerBody) throw err;
            const errValue: JsValue =
              err instanceof ThrowSignal
                ? err.value
                : err instanceof JsError
                  ? ({ name: err.jsName, message: err.message } as unknown as JsValue)
                  : ({ name: "Error", message: (err as Error).message } as unknown as JsValue);
            const catchEnv = new Env(env);
            if (node.handlerParam) catchEnv.declare(node.handlerParam as string, errValue);
            this.execStatement(node.handlerBody as Node, catchEnv);
          }
        } finally {
          if (node.finalizer) this.execStatement(node.finalizer as Node, new Env(env));
        }
        return;
      }
      default:
        throw new JsError("SyntaxError", `unknown statement type ${node.type}`);
    }
  }

  callFunction(fn: JsFunction, args: JsValue[], thisArg?: JsValue): JsValue {
    if ((fn.body as unknown as { type: string }).type === "Native") {
      const native = (fn.body as unknown as { fn: (...a: JsValue[]) => JsValue }).fn;
      return native(...args);
    }
    const callEnv = new Env(fn.closure);
    fn.params.forEach((p, i) => callEnv.declare(p, args[i]));
    if (thisArg !== undefined) callEnv.declare("this", thisArg);
    if (fn.isExpr) {
      // arrow with expression body
      return this.evalExpr(fn.body, callEnv);
    }
    try {
      if (fn.body.type === "Block") this.execBlockBody(fn.body.body as Node[], callEnv);
      else this.execStatement(fn.body, callEnv);
    } catch (err) {
      if (err instanceof ReturnSignal) return err.value;
      throw err;
    }
    return undefined;
  }

  evalExpr(node: Node, env: Env): JsValue {
    switch (node.type) {
      case "Literal":
        return node.value as JsValue;
      case "Template": {
        const parts = node.parts as TemplatePart[];
        let out = "";
        for (const p of parts) {
          if ("text" in p) out += p.text;
          else out += displayValue(this.evalSubExpr(p.expr, env));
        }
        return out;
      }
      case "Identifier":
        return env.get(node.name as string);
      case "ArrayLit":
        return (node.elements as Node[]).map((e) => this.evalExpr(e, env));
      case "ObjectLit": {
        const obj: Record<string, JsValue> = {};
        for (const prop of node.properties as { key: string; value: Node; computed: boolean }[]) {
          if (prop.computed) {
            const pair = prop.value as unknown as { keyExpr: Node; value: Node };
            const key = String(this.evalExpr(pair.keyExpr, env));
            obj[key] = this.evalExpr(pair.value, env);
          } else {
            obj[prop.key] = this.evalExpr(prop.value, env);
          }
        }
        return obj;
      }
      case "Arrow":
        return {
          __jsfn: true,
          params: node.params as string[],
          body: node.body as Node,
          closure: env,
          isExpr: node.expression as boolean,
        };
      case "FunctionExpr":
        return { __jsfn: true, params: node.params as string[], body: node.body as Node, closure: env, isExpr: false };
      case "Unary": {
        const v = this.evalExpr(node.argument as Node, env);
        switch (node.operator) {
          case "!": return !truthy(v);
          case "-": return -(v as number);
          case "+": return +(v as number);
        }
        break;
      }
      case "Typeof":
        return jsTypeof(this.evalExpr(node.argument as Node, env));
      case "Await": {
        const v = this.evalExpr(node.argument as Node, env);
        return isPromise(v) ? v.value : v;
      }
      case "Update": {
        const target = node.argument as Node;
        const old = this.evalExpr(target, env) as number;
        const next = node.operator === "++" ? old + 1 : old - 1;
        this.assignTo(target, next, env);
        return node.prefix ? next : old;
      }
      case "Binary":
        return this.evalBinary(node.operator as string, this.evalExpr(node.left as Node, env), this.evalExpr(node.right as Node, env));
      case "Logical": {
        const left = this.evalExpr(node.left as Node, env);
        if (node.operator === "&&") return truthy(left) ? this.evalExpr(node.right as Node, env) : left;
        return truthy(left) ? left : this.evalExpr(node.right as Node, env);
      }
      case "Conditional":
        return truthy(this.evalExpr(node.test as Node, env))
          ? this.evalExpr(node.consequent as Node, env)
          : this.evalExpr(node.alternate as Node, env);
      case "Assign": {
        let value: JsValue;
        if (node.operator === "=") {
          value = this.evalExpr(node.right as Node, env);
        } else {
          const old = this.evalExpr(node.left as Node, env);
          const rhs = this.evalExpr(node.right as Node, env);
          const op = (node.operator as string)[0];
          value = this.evalBinary(op, old, rhs);
        }
        this.assignTo(node.left as Node, value, env);
        return value;
      }
      case "Member": {
        const obj = this.evalExpr(node.object as Node, env);
        const key = node.computed
          ? this.evalExpr(node.property as Node, env)
          : (node.property as Node).value;
        return this.getMember(obj, key as string | number);
      }
      case "Call": {
        const callee = node.callee as Node;
        let thisArg: JsValue | undefined;
        let fn: JsValue;
        if (callee.type === "Member") {
          const obj = this.evalExpr(callee.object as Node, env);
          const key = callee.computed
            ? this.evalExpr(callee.property as Node, env)
            : (callee.property as Node).value;
          thisArg = obj;
          fn = this.getMethod(obj, key as string, env);
        } else {
          fn = this.evalExpr(callee, env);
        }
        const args = (node.arguments as Node[]).map((a) => this.evalExpr(a, env));
        if (!isFn(fn)) throw new JsError("TypeError", `${this.describeCallee(callee)} is not a function`);
        return this.callFunction(fn, args, thisArg);
      }
      default:
        throw new JsError("SyntaxError", `unknown expression type ${node.type}`);
    }
    return undefined;
  }

  describeCallee(node: Node): string {
    if (node.type === "Identifier") return node.name as string;
    if (node.type === "Member" && !node.computed) return `.${(node.property as Node).value}`;
    return "value";
  }

  evalSubExpr(src: string, env: Env): JsValue {
    const tokens = tokenize(src);
    const expr = new Parser(tokens).parseAssign();
    return this.evalExpr(expr, env);
  }

  assignTo(target: Node, value: JsValue, env: Env) {
    if (target.type === "Identifier") {
      env.set(target.name as string, value);
      return;
    }
    if (target.type === "Member") {
      const obj = this.evalExpr(target.object as Node, env);
      const key = target.computed
        ? this.evalExpr(target.property as Node, env)
        : (target.property as Node).value;
      if (Array.isArray(obj)) {
        (obj as JsValue[])[key as number] = value;
      } else if (obj && typeof obj === "object") {
        (obj as Record<string, JsValue>)[String(key)] = value;
      } else {
        throw new JsError("TypeError", "cannot set property on non-object");
      }
      return;
    }
    throw new JsError("SyntaxError", "invalid assignment target");
  }

  evalBinary(op: string, l: JsValue, r: JsValue): JsValue {
    switch (op) {
      case "+":
        if (typeof l === "string" || typeof r === "string") return displayValue(l) + displayValue(r);
        if (Array.isArray(l) && Array.isArray(r)) return [...l, ...r];
        return (l as number) + (r as number);
      case "-":
        return (l as number) - (r as number);
      case "*":
        return (l as number) * (r as number);
      case "/":
        return (l as number) / (r as number);
      case "%":
        return (l as number) % (r as number);
      case "===":
      case "==":
        return deepEqual(l, r);
      case "!==":
      case "!=":
        return !deepEqual(l, r);
      case "<":
        return (l as number) < (r as number);
      case ">":
        return (l as number) > (r as number);
      case "<=":
        return (l as number) <= (r as number);
      case ">=":
        return (l as number) >= (r as number);
    }
    throw new JsError("SyntaxError", `unknown operator ${op}`);
  }

  getMember(obj: JsValue, key: string | number): JsValue {
    if (obj === undefined || obj === null) {
      throw new JsError("TypeError", `cannot read properties of ${obj} (reading '${key}')`);
    }
    if (typeof obj === "string") {
      if (key === "length") return obj.length;
      if (typeof key === "number") return obj[key];
      return this.stringMethod(obj, key as string);
    }
    if (Array.isArray(obj)) {
      if (key === "length") return obj.length;
      if (typeof key === "number" || /^\d+$/.test(String(key))) return obj[Number(key)];
      return this.arrayMethod(obj, key as string);
    }
    if (isFn(obj) || isPromise(obj)) {
      if (isPromise(obj) && key === "then") return this.promiseMethod(obj, "then");
      if (isPromise(obj) && key === "catch") return this.promiseMethod(obj, "catch");
      return undefined;
    }
    return (obj as Record<string, JsValue>)[String(key)];
  }

  getMethod(obj: JsValue, key: string, _env: Env): JsValue {
    const m = this.getMember(obj, key);
    if (m !== undefined) return m;
    throw new JsError("TypeError", `${key} is not a function`);
  }

  stringMethod(s: string, name: string): JsValue {
    switch (name) {
      case "toUpperCase": return this.nativeFn(name, () => s.toUpperCase());
      case "toLowerCase": return this.nativeFn(name, () => s.toLowerCase());
      case "trim": return this.nativeFn(name, () => s.trim());
      case "includes": return this.nativeFn(name, (x: JsValue) => s.includes(String(x)));
      case "split": return this.nativeFn(name, (sep: JsValue) => s.split(String(sep)));
      case "slice": return this.nativeFn(name, (a: JsValue, b?: JsValue) => s.slice(a as number, b as number | undefined));
      case "indexOf": return this.nativeFn(name, (x: JsValue) => s.indexOf(String(x)));
      case "startsWith": return this.nativeFn(name, (x: JsValue) => s.startsWith(String(x)));
      case "repeat": return this.nativeFn(name, (x: JsValue) => s.repeat(x as number));
      case "charAt": return this.nativeFn(name, (x: JsValue) => s.charAt(x as number));
      default:
        throw new JsError("TypeError", `"".${name} is not supported here`);
    }
  }

  arrayMethod(arr: JsValue[], name: string): JsValue {
    switch (name) {
      case "push": return this.nativeFn(name, (...xs: JsValue[]) => { arr.push(...xs); return arr.length; });
      case "pop": return this.nativeFn(name, () => arr.pop());
      case "map": return this.nativeFn(name, (fn: JsValue) => arr.map((x, i) => this.callFunction(fn as JsFunction, [x, i])));
      case "filter": return this.nativeFn(name, (fn: JsValue) => arr.filter((x, i) => truthy(this.callFunction(fn as JsFunction, [x, i]))));
      case "forEach": return this.nativeFn(name, (fn: JsValue) => { arr.forEach((x, i) => this.callFunction(fn as JsFunction, [x, i])); return undefined; });
      case "find": return this.nativeFn(name, (fn: JsValue) => arr.find((x, i) => truthy(this.callFunction(fn as JsFunction, [x, i]))));
      case "some": return this.nativeFn(name, (fn: JsValue) => arr.some((x, i) => truthy(this.callFunction(fn as JsFunction, [x, i]))));
      case "every": return this.nativeFn(name, (fn: JsValue) => arr.every((x, i) => truthy(this.callFunction(fn as JsFunction, [x, i]))));
      case "reduce": return this.nativeFn(name, (fn: JsValue, init?: JsValue) => {
        let acc = init;
        let start = 0;
        if (acc === undefined) { acc = arr[0]; start = 1; }
        for (let i = start; i < arr.length; i++) acc = this.callFunction(fn as JsFunction, [acc as JsValue, arr[i], i]);
        return acc;
      });
      case "join": return this.nativeFn(name, (sep?: JsValue) => arr.map(displayValue).join(sep === undefined ? "," : String(sep)));
      case "includes": return this.nativeFn(name, (x: JsValue) => arr.some((v) => deepEqual(v, x)));
      case "indexOf": return this.nativeFn(name, (x: JsValue) => arr.findIndex((v) => deepEqual(v, x)));
      case "slice": return this.nativeFn(name, (a?: JsValue, b?: JsValue) => arr.slice(a as number | undefined, b as number | undefined));
      case "sort": return this.nativeFn(name, (fn?: JsValue) => {
        arr.sort(fn ? (a, b) => this.callFunction(fn as JsFunction, [a, b]) as number : undefined);
        return arr;
      });
      case "reverse": return this.nativeFn(name, () => { arr.reverse(); return arr; });
      case "concat": return this.nativeFn(name, (...others: JsValue[]) => arr.concat(...(others as JsValue[][])));
      case "flat": return this.nativeFn(name, () => arr.flat() as JsValue[]);
      default:
        throw new JsError("TypeError", `[].${name} is not supported here`);
    }
  }

  promiseMethod(p: JsPromise, name: string): JsValue {
    if (name === "then") {
      return this.nativeFn(name, (onFulfilled: JsValue) => {
        const result = this.callFunction(onFulfilled as JsFunction, [p.value]);
        return isPromise(result) ? result : wrapPromise(result);
      });
    }
    return this.nativeFn(name, () => p);
  }
}

function wrapPromise(value: JsValue): JsPromise {
  return { __promise: true, value };
}

function deepEqual(a: JsValue, b: JsValue): boolean {
  if (a === b) return true;
  if (Array.isArray(a) && Array.isArray(b)) {
    return a.length === b.length && a.every((v, i) => deepEqual(v, b[i]));
  }
  if (a && b && typeof a === "object" && typeof b === "object" && !isFn(a) && !isFn(b)) {
    const ak = Object.keys(a);
    const bk = Object.keys(b as object);
    if (ak.length !== bk.length) return false;
    return ak.every((k) => deepEqual((a as Record<string, JsValue>)[k], (b as Record<string, JsValue>)[k]));
  }
  return false;
}

function jsonStringify(v: JsValue): string {
  if (isFn(v) || isPromise(v)) return "undefined";
  // Only intercept our internal function/promise wrappers so JSON.stringify's
  // own correct native handling of `undefined` decides the rest: dropped for
  // object properties, converted to null for array elements — same as real JS.
  const replacer = (_k: string, val: unknown) => (isFn(val) || isPromise(val) ? undefined : val);
  const result = JSON.stringify(v, replacer);
  return result === undefined ? "undefined" : result;
}

export function runJsExt(src: string): OutputLine[] {
  return new Interpreter().run(src);
}
