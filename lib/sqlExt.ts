import type { OutputLine } from "./python";

/**
 * A small in-memory SQL engine — real CREATE TABLE / INSERT INTO / SELECT
 * with WHERE, a single JOIN, GROUP BY + aggregates (COUNT/SUM/AVG/MIN/MAX),
 * ORDER BY, and LIMIT — so module 8's lessons can have students write and
 * run actual SQL instead of simulating tables as Python dicts. Deliberately
 * not a real database: no indexes, no subqueries, no multi-table joins
 * beyond one JOIN, no transactions.
 */

type SqlValue = string | number | boolean | null;
type Row = Record<string, SqlValue>;
type Table = { columns: string[]; rows: Row[] };

class SqlError extends Error {}

// ---------- Tokenizer ----------

type Token = { type: "kw" | "ident" | "num" | "str" | "punct" | "eof"; value: string };

const KEYWORDS = new Set([
  "create", "table", "insert", "into", "values", "select", "from", "where",
  "join", "inner", "left", "on", "group", "by", "order", "asc", "desc",
  "limit", "and", "or", "not", "as", "count", "sum", "avg", "min", "max",
  "null", "true", "false", "distinct",
]);

function tokenize(src: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  const n = src.length;
  while (i < n) {
    const ch = src[i];
    if (/\s/.test(ch)) { i++; continue; }
    if (ch === "-" && src[i + 1] === "-") {
      while (i < n && src[i] !== "\n") i++;
      continue;
    }
    if (/[0-9]/.test(ch)) {
      let j = i;
      while (j < n && /[0-9.]/.test(src[j])) j++;
      tokens.push({ type: "num", value: src.slice(i, j) });
      i = j;
      continue;
    }
    if (ch === "'" || ch === '"') {
      const quote = ch;
      let j = i + 1;
      let out = "";
      while (j < n && src[j] !== quote) {
        out += src[j];
        j++;
      }
      tokens.push({ type: "str", value: out });
      i = j + 1;
      continue;
    }
    if (/[A-Za-z_]/.test(ch)) {
      let j = i;
      while (j < n && /[A-Za-z0-9_]/.test(src[j])) j++;
      const word = src.slice(i, j);
      tokens.push({ type: KEYWORDS.has(word.toLowerCase()) ? "kw" : "ident", value: word });
      i = j;
      continue;
    }
    const two = src.slice(i, i + 2);
    if (["!=", "<>", "<=", ">="].includes(two)) {
      tokens.push({ type: "punct", value: two === "<>" ? "!=" : two });
      i += 2;
      continue;
    }
    if ("(),;.*=<>".includes(ch)) {
      tokens.push({ type: "punct", value: ch });
      i++;
      continue;
    }
    throw new SqlError(`unexpected character '${ch}'`);
  }
  tokens.push({ type: "eof", value: "" });
  return tokens;
}

// ---------- AST ----------

type Expr =
  | { kind: "col"; table: string | null; name: string }
  | { kind: "lit"; value: SqlValue }
  | { kind: "star" }
  | { kind: "agg"; fn: "count" | "sum" | "avg" | "min" | "max"; arg: Expr | "star"; alias?: string }
  | { kind: "binop"; op: string; left: Expr; right: Expr };

type CreateStmt = { type: "create"; table: string; columns: string[] };
type InsertStmt = { type: "insert"; table: string; values: SqlValue[] };
type SelectStmt = {
  type: "select";
  columns: { expr: Expr; alias: string | null }[];
  from: string;
  fromAlias: string | null;
  join: { table: string; alias: string | null; on: Expr } | null;
  where: Expr | null;
  groupBy: string[];
  orderBy: { col: string; dir: "asc" | "desc" } | null;
  limit: number | null;
};

type Stmt = CreateStmt | InsertStmt | SelectStmt;

// ---------- Parser ----------

class Parser {
  tokens: Token[];
  pos = 0;
  constructor(tokens: Token[]) {
    this.tokens = tokens;
  }
  peek(o = 0) { return this.tokens[this.pos + o]; }
  next() { return this.tokens[this.pos++]; }
  atKw(v: string) { const t = this.peek(); return t.type === "kw" && t.value.toLowerCase() === v; }
  atPunct(v: string) { const t = this.peek(); return t.type === "punct" && t.value === v; }
  expectPunct(v: string) {
    if (!this.atPunct(v)) throw new SqlError(`expected '${v}' but got '${this.peek().value || "end of input"}'`);
    return this.next();
  }
  expectKw(v: string) {
    if (!this.atKw(v)) throw new SqlError(`expected '${v.toUpperCase()}' but got '${this.peek().value || "end of input"}'`);
    return this.next();
  }

  parseProgram(): Stmt[] {
    const stmts: Stmt[] = [];
    while (this.peek().type !== "eof") {
      stmts.push(this.parseStatement());
      while (this.atPunct(";")) this.next();
    }
    return stmts;
  }

  parseStatement(): Stmt {
    if (this.atKw("create")) return this.parseCreate();
    if (this.atKw("insert")) return this.parseInsert();
    if (this.atKw("select")) return this.parseSelect();
    throw new SqlError(`expected CREATE, INSERT, or SELECT but got '${this.peek().value}'`);
  }

  parseCreate(): CreateStmt {
    this.expectKw("create");
    this.expectKw("table");
    const table = this.next().value;
    this.expectPunct("(");
    const columns: string[] = [];
    while (!this.atPunct(")")) {
      columns.push(this.next().value);
      if (this.atPunct(",")) this.next();
    }
    this.expectPunct(")");
    return { type: "create", table, columns };
  }

  parseInsert(): InsertStmt {
    this.expectKw("insert");
    this.expectKw("into");
    const table = this.next().value;
    this.expectKw("values");
    this.expectPunct("(");
    const values: SqlValue[] = [];
    while (!this.atPunct(")")) {
      values.push(this.parseLiteralValue());
      if (this.atPunct(",")) this.next();
    }
    this.expectPunct(")");
    return { type: "insert", table, values };
  }

  parseLiteralValue(): SqlValue {
    const t = this.next();
    if (t.type === "num") return Number(t.value);
    if (t.type === "str") return t.value;
    if (t.type === "kw" && t.value.toLowerCase() === "null") return null;
    if (t.type === "kw" && t.value.toLowerCase() === "true") return true;
    if (t.type === "kw" && t.value.toLowerCase() === "false") return false;
    throw new SqlError(`expected a value but got '${t.value}'`);
  }

  parseSelect(): SelectStmt {
    this.expectKw("select");
    if (this.atKw("distinct")) this.next(); // accepted, not specially handled
    const columns: { expr: Expr; alias: string | null }[] = [];
    if (this.atPunct("*")) {
      this.next();
      columns.push({ expr: { kind: "star" }, alias: null });
    } else {
      for (;;) {
        const expr = this.parseSelectExpr();
        let alias: string | null = null;
        if (this.atKw("as")) {
          this.next();
          alias = this.next().value;
        }
        columns.push({ expr, alias });
        if (this.atPunct(",")) { this.next(); continue; }
        break;
      }
    }
    this.expectKw("from");
    const from = this.next().value;
    const fromAlias = this.parseOptionalAlias();

    let join: SelectStmt["join"] = null;
    if (this.atKw("inner") || this.atKw("left")) this.next();
    if (this.atKw("join")) {
      this.next();
      const joinTable = this.next().value;
      const joinAlias = this.parseOptionalAlias();
      this.expectKw("on");
      const on = this.parseBoolExpr();
      join = { table: joinTable, alias: joinAlias, on };
    }

    let where: Expr | null = null;
    if (this.atKw("where")) {
      this.next();
      where = this.parseBoolExpr();
    }

    const groupBy: string[] = [];
    if (this.atKw("group")) {
      this.next();
      this.expectKw("by");
      for (;;) {
        groupBy.push(this.next().value);
        if (this.atPunct(",")) { this.next(); continue; }
        break;
      }
    }

    let orderBy: SelectStmt["orderBy"] = null;
    if (this.atKw("order")) {
      this.next();
      this.expectKw("by");
      const col = this.next().value;
      let dir: "asc" | "desc" = "asc";
      if (this.atKw("asc")) { this.next(); dir = "asc"; }
      else if (this.atKw("desc")) { this.next(); dir = "desc"; }
      orderBy = { col, dir };
    }

    let limit: number | null = null;
    if (this.atKw("limit")) {
      this.next();
      limit = Number(this.next().value);
    }

    return { type: "select", columns, from, fromAlias, join, where, groupBy, orderBy, limit };
  }

  parseOptionalAlias(): string | null {
    if (this.atKw("as")) {
      this.next();
      return this.next().value;
    }
    // bare alias: `FROM users u` (next token is a plain identifier, not a keyword that starts a clause)
    if (this.peek().type === "ident") return this.next().value;
    return null;
  }

  parseSelectExpr(): Expr {
    for (const fn of ["count", "sum", "avg", "min", "max"] as const) {
      if (this.atKw(fn)) {
        this.next();
        this.expectPunct("(");
        let arg: Expr | "star";
        if (this.atPunct("*")) {
          this.next();
          arg = "star";
        } else {
          arg = this.parseColumnRef();
        }
        this.expectPunct(")");
        return { kind: "agg", fn, arg };
      }
    }
    return this.parseColumnRef();
  }

  parseColumnRef(): Expr {
    const t = this.next();
    if (t.type === "num") return { kind: "lit", value: Number(t.value) };
    if (t.type === "str") return { kind: "lit", value: t.value };
    if (this.atPunct(".")) {
      this.next();
      const name = this.next().value;
      return { kind: "col", table: t.value, name };
    }
    return { kind: "col", table: null, name: t.value };
  }

  // WHERE / ON: a chain of comparisons joined by AND / OR (left-to-right, AND binds tighter).
  parseBoolExpr(): Expr {
    let left = this.parseAndTerm();
    while (this.atKw("or")) {
      this.next();
      const right = this.parseAndTerm();
      left = { kind: "binop", op: "or", left, right };
    }
    return left;
  }
  parseAndTerm(): Expr {
    let left = this.parseComparison();
    while (this.atKw("and")) {
      this.next();
      const right = this.parseComparison();
      left = { kind: "binop", op: "and", left, right };
    }
    return left;
  }
  parseComparison(): Expr {
    const left = this.parseColumnRef();
    const opToken = this.peek();
    const ops = ["=", "!=", "<", ">", "<=", ">="];
    if (opToken.type === "punct" && ops.includes(opToken.value)) {
      this.next();
      const right = this.parseColumnRef();
      return { kind: "binop", op: opToken.value, left, right };
    }
    return left;
  }
}

// ---------- Executor ----------

class Database {
  tables = new Map<string, Table>();

  create(stmt: CreateStmt) {
    if (this.tables.has(stmt.table)) throw new SqlError(`table '${stmt.table}' already exists`);
    this.tables.set(stmt.table, { columns: stmt.columns, rows: [] });
  }

  insert(stmt: InsertStmt) {
    const table = this.tables.get(stmt.table);
    if (!table) throw new SqlError(`no such table: ${stmt.table}`);
    if (stmt.values.length !== table.columns.length) {
      throw new SqlError(`table ${stmt.table} has ${table.columns.length} columns but ${stmt.values.length} values were supplied`);
    }
    const row: Row = {};
    table.columns.forEach((c, i) => (row[c] = stmt.values[i]));
    table.rows.push(row);
  }

  select(stmt: SelectStmt): { headers: string[]; rows: SqlValue[][] } {
    const base = this.tables.get(stmt.from);
    if (!base) throw new SqlError(`no such table: ${stmt.from}`);
    const baseAlias = stmt.fromAlias ?? stmt.from;

    // Build the working row set as tagged rows: { [alias.col]: value, [col]: value }
    let working: Row[] = base.rows.map((r) => this.tagRow(r, baseAlias));

    if (stmt.join) {
      const joinTable = this.tables.get(stmt.join.table);
      if (!joinTable) throw new SqlError(`no such table: ${stmt.join.table}`);
      const joinAlias = stmt.join.alias ?? stmt.join.table;
      const joined: Row[] = [];
      for (const leftRow of working) {
        for (const rightRow of joinTable.rows) {
          const merged = { ...leftRow, ...this.tagRow(rightRow, joinAlias) };
          if (truthy(this.evalExpr(stmt.join.on, merged))) joined.push(merged);
        }
      }
      working = joined;
    }

    if (stmt.where) {
      working = working.filter((r) => truthy(this.evalExpr(stmt.where as Expr, r)));
    }

    const hasAgg = stmt.columns.some((c) => c.expr.kind === "agg");

    if (stmt.groupBy.length || hasAgg) {
      const groups = new Map<string, Row[]>();
      if (stmt.groupBy.length === 0) {
        groups.set("__all__", working);
      } else {
        for (const row of working) {
          const key = stmt.groupBy.map((g) => String(this.readCol(row, g))).join("");
          if (!groups.has(key)) groups.set(key, []);
          (groups.get(key) as Row[]).push(row);
        }
      }
      const headers = stmt.columns.map((c, i) => c.alias ?? this.exprLabel(c.expr, i));
      const rows: SqlValue[][] = [];
      for (const groupRows of groups.values()) {
        const rowOut: SqlValue[] = stmt.columns.map((c) => this.evalSelectExpr(c.expr, groupRows));
        rows.push(rowOut);
      }
      return { headers, rows: this.applyOrderLimit(rows, headers, stmt) };
    }

    // No grouping/aggregation — project each row directly.
    let projected: { row: Row; values: SqlValue[] }[];
    let headers: string[];
    if (stmt.columns.length === 1 && stmt.columns[0].expr.kind === "star") {
      headers = base.columns.concat(stmt.join ? this.tables.get(stmt.join.table)!.columns.map((c) => `${stmt.join!.alias ?? stmt.join!.table}.${c}`) : []);
      projected = working.map((r) => ({
        row: r,
        values: base.columns.map((c) => this.readCol(r, c)).concat(
          stmt.join ? this.tables.get(stmt.join!.table)!.columns.map((c) => this.readCol(r, `${stmt.join!.alias ?? stmt.join!.table}.${c}`)) : [],
        ),
      }));
    } else {
      headers = stmt.columns.map((c, i) => c.alias ?? this.exprLabel(c.expr, i));
      projected = working.map((r) => ({ row: r, values: stmt.columns.map((c) => this.evalExpr(c.expr, r)) }));
    }

    let rows = projected.map((p) => p.values);
    rows = this.applyOrderOnProjected(rows, headers, working, stmt);
    if (stmt.limit != null) rows = rows.slice(0, stmt.limit);
    return { headers, rows };
  }

  tagRow(row: Row, alias: string): Row {
    const tagged: Row = { ...row };
    for (const [k, v] of Object.entries(row)) tagged[`${alias}.${k}`] = v;
    return tagged;
  }

  readCol(row: Row, name: string): SqlValue {
    if (name in row) return row[name];
    // try suffix match on qualified keys (col without table prefix)
    const match = Object.keys(row).find((k) => k === name || k.endsWith(`.${name}`));
    return match ? row[match] : null;
  }

  exprLabel(e: Expr, i: number): string {
    if (e.kind === "col") return e.name;
    if (e.kind === "agg") return `${e.fn}(${e.arg === "star" ? "*" : e.arg.kind === "col" ? e.arg.name : "expr"})`;
    return `col${i + 1}`;
  }

  evalSelectExpr(e: Expr, rows: Row[]): SqlValue {
    if (e.kind === "agg") {
      if (e.fn === "count") {
        if (e.arg === "star") return rows.length;
        return rows.filter((r) => this.evalExpr(e.arg as Expr, r) !== null).length;
      }
      const nums = rows.map((r) => Number(this.evalExpr(e.arg as Expr, r))).filter((n) => !Number.isNaN(n));
      if (e.fn === "sum") return nums.reduce((a, b) => a + b, 0);
      if (e.fn === "avg") return nums.length ? nums.reduce((a, b) => a + b, 0) / nums.length : null;
      if (e.fn === "min") return nums.length ? Math.min(...nums) : null;
      if (e.fn === "max") return nums.length ? Math.max(...nums) : null;
    }
    // non-aggregate column in a grouped query: take the first row's value
    return rows.length ? this.evalExpr(e, rows[0]) : null;
  }

  evalExpr(e: Expr, row: Row): SqlValue {
    switch (e.kind) {
      case "lit": return e.value;
      case "col": return e.table ? this.readCol(row, `${e.table}.${e.name}`) : this.readCol(row, e.name);
      case "star": return null;
      case "agg": return this.evalSelectExpr(e, [row]);
      case "binop": {
        if (e.op === "and") return truthy(this.evalExpr(e.left, row)) && truthy(this.evalExpr(e.right, row));
        if (e.op === "or") return truthy(this.evalExpr(e.left, row)) || truthy(this.evalExpr(e.right, row));
        const l = this.evalExpr(e.left, row);
        const r = this.evalExpr(e.right, row);
        switch (e.op) {
          case "=": return l === r;
          case "!=": return l !== r;
          case "<": return (l as number) < (r as number);
          case ">": return (l as number) > (r as number);
          case "<=": return (l as number) <= (r as number);
          case ">=": return (l as number) >= (r as number);
        }
        throw new SqlError(`unsupported operator ${e.op}`);
      }
    }
  }

  applyOrderLimit(rows: SqlValue[][], headers: string[], stmt: SelectStmt): SqlValue[][] {
    let out = rows;
    if (stmt.orderBy) {
      const idx = headers.indexOf(stmt.orderBy.col);
      if (idx >= 0) {
        out = [...out].sort((a, b) => {
          const av = a[idx];
          const bv = b[idx];
          const cmp = av === bv ? 0 : (av as number) < (bv as number) ? -1 : 1;
          return stmt.orderBy!.dir === "desc" ? -cmp : cmp;
        });
      }
    }
    if (stmt.limit != null) out = out.slice(0, stmt.limit);
    return out;
  }

  applyOrderOnProjected(rows: SqlValue[][], headers: string[], _workingRows: Row[], stmt: SelectStmt): SqlValue[][] {
    if (!stmt.orderBy) return rows;
    const idx = headers.indexOf(stmt.orderBy.col);
    if (idx < 0) return rows;
    const sorted = [...rows].sort((a, b) => {
      const av = a[idx];
      const bv = b[idx];
      const cmp = av === bv ? 0 : (av as number) < (bv as number) ? -1 : 1;
      return stmt.orderBy!.dir === "desc" ? -cmp : cmp;
    });
    return sorted;
  }
}

function truthy(v: SqlValue | boolean | null): boolean {
  return Boolean(v);
}

function formatCell(v: SqlValue): string {
  if (v === null || v === undefined) return "NULL";
  return String(v);
}

function renderTable(headers: string[], rows: SqlValue[][]): OutputLine[] {
  const widths = headers.map((h, i) => Math.max(h.length, ...rows.map((r) => formatCell(r[i]).length), 3));
  const pad = (s: string, w: number) => s + " ".repeat(Math.max(0, w - s.length));
  const headerLine = headers.map((h, i) => pad(h, widths[i])).join(" | ");
  const sepLine = widths.map((w) => "-".repeat(w)).join("-+-");
  const lines: OutputLine[] = [
    { text: headerLine, color: "#1F2937" },
    { text: sepLine, color: "#9AA3AF" },
  ];
  for (const row of rows) {
    lines.push({ text: row.map((v, i) => pad(formatCell(v), widths[i])).join(" | "), color: "#1F2937" });
  }
  lines.push({ text: `(${rows.length} row${rows.length === 1 ? "" : "s"})`, color: "#6B7280" });
  return lines;
}

export function runSqlExt(src: string): OutputLine[] {
  const db = new Database();
  const out: OutputLine[] = [];
  try {
    const stmts = new Parser(tokenize(src)).parseProgram();
    let sawSelect = false;
    for (const stmt of stmts) {
      if (stmt.type === "create") {
        db.create(stmt);
      } else if (stmt.type === "insert") {
        db.insert(stmt);
      } else if (stmt.type === "select") {
        sawSelect = true;
        const { headers, rows } = db.select(stmt);
        out.push(...renderTable(headers, rows));
        out.push({ text: "", color: "#1F2937" });
      }
    }
    if (!sawSelect) out.push({ text: "(no SELECT statement — nothing to show)", color: "#6B7280" });
  } catch (err) {
    const msg = err instanceof SqlError ? `SQLError: ${err.message}` : (err as Error).message;
    out.push({ text: msg, color: "#DC2626" });
  }
  return out;
}
