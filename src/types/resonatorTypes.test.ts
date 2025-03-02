import { getAscensions, nextLevel, prevLevel } from "./resonatorTypes";

const ascensionMap = {
  "20*": 1,
  "40*": 2,
  "50*": 3,
  "60*": 4,
  "70*": 5,
  "80*": 6,
}
describe('testing getAscensions materials', () => {
  test('1 -> 90', () => {
    const [from, to] = [1, 90];
    const ascensions = getAscensions(from, to);
    expect(ascensions).toStrictEqual([1, 2, 3, 4, 5, 6]);
  });

  test('any ascension level -> 90', () => {
    const tmpArr = [];
    for (const [ascension, key] of Object.entries(ascensionMap).reverse()) {
      const [from, to] = [ascension, 90];
      const ascensions = getAscensions(from, to);
      expect(ascensions).toStrictEqual(tmpArr.slice().reverse());
      tmpArr.push(key);
    }
  });

  test('any pre-ascension level -> ascension level', () => {
    for (const [ascension, key] of Object.entries(ascensionMap)) {
      const [from, to] = [parseInt(ascension), ascension];
      const ascensions = getAscensions(from, to);
      expect(ascensions).toStrictEqual([key]);
    }
  });

  test('1 -> any pre-ascension level', () => {
    const tmpArr = [];
    for (const [ascension, key] of Object.entries(ascensionMap)) {
      const [from, to] = [1, parseInt(ascension as string)];
      const ascensions = getAscensions(from, to);
      expect(ascensions).toStrictEqual(tmpArr);

      tmpArr.push(key);
    }
  });
});

describe('test next and prev level', () => {
  test('test nextLevel on all values', () => {
    // testing 1,2,...,89)
    const numbers = Array.from({ length: 89 }, (_, i) => i + 1);
    for (const number of numbers) {
      if (Object.keys(ascensionMap).includes(`${number}*`)) {
        expect(nextLevel(number)).toBe(`${number}*`);
      } else {
        expect(nextLevel(number)).toBe(number + 1);
      }
    }

    for (const ascension of Object.keys(ascensionMap)) {
      expect(nextLevel(ascension)).toBe(parseInt(ascension as string) + 1);
    }
  })

  test('test prevLevel on all values', () => {
    // testing 2,...,90)
    const numbers = Array.from({ length: 89 }, (_, i) => i + 2);
    for (const number of numbers) {
      if (Object.keys(ascensionMap).includes(`${number - 1}*`)) {
        expect(prevLevel(number)).toBe(`${number - 1}*`);
      } else {
        expect(prevLevel(number)).toBe(number - 1);
      }
    }

    for (const ascension of Object.keys(ascensionMap)) {
      expect(prevLevel(ascension)).toBe(parseInt(ascension as string));
    }
  })
})