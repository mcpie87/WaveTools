export function formatPercent(num: number, precision: number = 2): string {
  return `${(num * 100).toFixed(precision)}%`;
}

export function formatSubstatValue(num: number): string {
  return num >= 1 ? num.toString() : formatPercent(num, 1);
}

export function formatNumber(num: string | number): string {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}