function countAsync(rdx: number[], arr: Uint8Array | Uint16Array, i: number, callback: () => void) {
  const start = Date.now();
  while (i < arr.length) {
    rdx[arr[i++]]++;
    if (!(i % 65536) && Date.now() - start > 1000 / 90) {
      requestAnimationFrame(() => countAsync(rdx, arr, i, callback));
      return;
    }
  }
  callback();
}

function fillAsync(rdx: number[], arr: Uint8Array | Uint16Array, i: number, n: number, callback: (i: number) => void) {
  const start = Date.now();
  while (i < arr.length && n < rdx.length) {
    arr.fill(n, i, (i += rdx[n++]));
    if (Date.now() - start > 1000 / 90) {
      requestAnimationFrame(() => fillAsync(rdx, arr, i, n, callback));
      return;
    }
  }
  callback(i);
}

export function radixSortAsync(arr: Uint8Array | Uint16Array, radix: 256 | 65536) {
  return new Promise(resolve => {
    const rdx = new Array(radix).fill(0);
    countAsync(rdx, arr, 0, () => {
      fillAsync(rdx, arr, 0, 0, () => {
        resolve();
      });
    });
  });
}

export function radixSortSignedAsync(arr: Uint8Array | Uint16Array, radix: 256 | 65536) {
  return new Promise(resolve => {
    const rdx = new Array(radix).fill(0);
    countAsync(rdx, arr, 0, () => {
      fillAsync(rdx, arr, 0, radix / 2, i => {
        fillAsync(rdx, arr, i, 0, () => {
          resolve();
        });
      });
    });
  });
}
