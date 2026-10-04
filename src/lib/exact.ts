/** Small exact-rational arithmetic layer. Decimal inputs never use floating-point thresholds. */
export class Q {
  readonly n: bigint;
  readonly d: bigint;
  constructor(n: bigint, d = 1n) {
    if (!d) throw new Error('Cannot divide by zero.');
    const gcd = (a: bigint, b: bigint): bigint => b ? gcd(b, a % b) : a;
    const sign = d < 0n ? -1n : 1n, g = gcd(n < 0n ? -n : n, d < 0n ? -d : d) || 1n;
    this.n = n / g * sign; this.d = d / g * sign;
  }
  static of(value: string | number | Q): Q {
    if (value instanceof Q) return value;
    const text = String(value);
    if (!/^-?\d+(\.\d+)?$/.test(text)) throw new Error('Use a finite decimal number.');
    const [whole, decimal = ''] = text.split('.');
    return new Q(BigInt(whole + decimal), 10n ** BigInt(decimal.length));
  }
  add(v: string | number | Q) { const b = Q.of(v); return new Q(this.n*b.d+b.n*this.d,this.d*b.d); }
  sub(v: string | number | Q) { const b = Q.of(v); return new Q(this.n*b.d-b.n*this.d,this.d*b.d); }
  mul(v: string | number | Q) { const b = Q.of(v); return new Q(this.n*b.n,this.d*b.d); }
  div(v: string | number | Q) { const b = Q.of(v); return new Q(this.n*b.d,this.d*b.n); }
  cmp(v: string | number | Q) { const b = Q.of(v), diff = this.n*b.d-b.n*this.d; return diff < 0n ? -1 : diff > 0n ? 1 : 0; }
  floor() { return this.n >= 0n ? this.n / this.d : -((-this.n+this.d-1n)/this.d); }
  ceil() { return this.n >= 0n ? (this.n+this.d-1n)/this.d : -((-this.n)/this.d); }
  number() { return Number(this.n)/Number(this.d); }
  fixed(digits = 2, upward = false) {
    const factor = 10n ** BigInt(digits);
    const scaled = this.mul(new Q(factor));
    const rounded = upward ? scaled.ceil() : scaled.add('0.5').floor();
    const sign = rounded < 0n ? '-' : '', raw = (rounded < 0n ? -rounded : rounded).toString().padStart(digits+1,'0');
    return sign + (digits ? raw.slice(0,-digits)+'.'+raw.slice(-digits) : raw);
  }
}
export const sum = (values: Q[]) => values.reduce((a,b) => a.add(b),Q.of(0));
export function decimal(value: unknown, label: string, min = '0', max = '100', optional = false, precision = 2) {
  if (optional && (value === '' || value === null || value === undefined)) return '';
  if (typeof value !== 'string' || !new RegExp(`^\\d+(\\.\\d{1,${precision}})?$`).test(value) || value.length > 16) throw new Error(`${label}: use a decimal with at most ${precision} places.`);
  const q = Q.of(value);
  if (q.cmp(min) < 0 || q.cmp(max) > 0) throw new Error(`${label}: enter ${min}–${max}.`);
  return value;
}
