export default function dataFind(
  data: Object[],
  key: string,
  value: string,
  // keys: string[] | string
) {
  return data.find(e => e[key] === value)
}
