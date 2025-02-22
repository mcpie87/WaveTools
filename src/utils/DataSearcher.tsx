export default function dataFind<T extends Record<string, unknown>>(
  data: T[],
  key: string,
  value: string,
  // keys: string[] | string
) {
  return data.find(e => e[key] === value)
}
