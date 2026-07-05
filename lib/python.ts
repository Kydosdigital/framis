export type OutputLine = { text: string; color: string };

/**
 * A deliberately tiny Python-ish interpreter — enough to make the Variables
 * lesson sandbox feel real: assignments, print(), string/number arithmetic,
 * f-strings, str()/int(). Ported from the Framis design prototype.
 */
export function runPython(src: string): OutputLine[] {
  const vars: Record<string, string | number> = {};
  const out: OutputLine[] = [];

  const splitTop = (s: string, sep: string): string[] => {
    const parts: string[] = [];
    let cur = "";
    let q: string | null = null;
    for (const ch of s) {
      if (q) {
        cur += ch;
        if (ch === q) q = null;
        continue;
      }
      if (ch === '"' || ch === "'") {
        q = ch;
        cur += ch;
        continue;
      }
      if (ch === sep) {
        parts.push(cur);
        cur = "";
        continue;
      }
      cur += ch;
    }
    parts.push(cur);
    return parts;
  };

  const evalExpr = (expr: string): string | number => {
    const e = expr.trim();
    let m: RegExpMatchArray | null;

    const plus = splitTop(e, "+");
    if (plus.length > 1) {
      let acc = evalExpr(plus[0]);
      for (let i = 1; i < plus.length; i++) {
        const v = evalExpr(plus[i]);
        acc =
          typeof acc === "string" || typeof v === "string"
            ? String(acc) + String(v)
            : (acc as number) + (v as number);
      }
      return acc;
    }
    const mul = splitTop(e, "*");
    if (mul.length > 1)
      return mul.map(evalExpr).reduce((a, b) => (a as number) * (b as number));
    const min = splitTop(e, "-");
    if (min.length > 1 && min[0].trim() !== "")
      return min.map(evalExpr).reduce((a, b) => (a as number) - (b as number));
    if ((m = e.match(/^f(["'])([\s\S]*)\1$/)))
      return m[2].replace(/\{([^}]+)\}/g, (_, v) => String(evalExpr(v)));
    if ((m = e.match(/^(["'])([\s\S]*)\1$/))) return m[2];
    if (/^-?\d+(\.\d+)?$/.test(e)) return Number(e);
    if ((m = e.match(/^str\((.+)\)$/))) return String(evalExpr(m[1]));
    if ((m = e.match(/^int\((.+)\)$/))) return parseInt(String(evalExpr(m[1])), 10);
    if (/^[A-Za-z_]\w*$/.test(e)) {
      if (e in vars) return vars[e];
      throw new Error("NameError: name '" + e + "' is not defined");
    }
    throw new Error("SyntaxError: couldn't understand: " + e);
  };

  try {
    for (const raw of src.split("\n")) {
      const line = raw.trim();
      if (!line || line.startsWith("#")) continue;
      let m: RegExpMatchArray | null;
      if ((m = line.match(/^print\((.*)\)\s*$/))) {
        const args =
          m[1].trim() === "" ? [] : splitTop(m[1], ",").map(evalExpr);
        out.push({ text: args.join(" "), color: "#1F2937" });
      } else if ((m = line.match(/^([A-Za-z_]\w*)\s*=\s*(.+)$/))) {
        vars[m[1]] = evalExpr(m[2]);
      } else {
        throw new Error("SyntaxError: couldn't understand: " + line);
      }
    }
    if (!out.length)
      out.push({ text: "(no output — did you call print()?)", color: "#6B7280" });
  } catch (err) {
    out.push({ text: (err as Error).message, color: "#DC2626" });
  }
  return out;
}

export const STARTER_CODE =
  'name = "Alex"\nage = 24\nprint(f"Hi {name}, you are {age} years old!")';
