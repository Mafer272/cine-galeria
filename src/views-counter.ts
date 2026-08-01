// src/viewsCounter.ts


export function createCounter(): () => number {
  let views = 0;
  return function count(): number {
    views++;
    return views;
  };
}
