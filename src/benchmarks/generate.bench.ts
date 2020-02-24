/* istanbul ignore file */

import * as index from "../index";

var benchmarking = false;
const widths = [256, 512, 1024, 2048, 4096];
const results = new Array(widths.length * 3).fill("pending");

export function isBenchmarking() {
  return benchmarking;
}

function insertRandomNumbers(i: number, array: Float64Array, callback: () => void) {
  for (let j = 0; j < 1e5; j++) array[i++] = Math.random() - 0.5;
  if (i >= array.length) return callback();
  requestAnimationFrame(() => insertRandomNumbers(i, array, callback));
}

function checkSorting(array: ArrayLike<number>) {
  if (true) {
    for (let i = 0; i < array.length - 1; i++) {
      if (array[i] > array[i + 1]) {
        console.error(array);
        throw new Error(`index:${i} (${array[i]} > ${array[i + 1]})`);
      }
    }
  }
}

function gpuFloat64Array(width: number) {
  const array = new Float64Array(Array.from(Array((width * width) / 2), () => Math.random() - 0.5));
  let start = performance.now();
  index.sort(array);
  checkSorting(array);
  return performance.now() - start;
}

function gpuFloat64ArrayAsync(width: number): Promise<number> {
  return new Promise(resolve => {
    const array = new Float64Array((width * width) / 2);
    insertRandomNumbers(0, array, () => {
      let start = performance.now();
      index.sortAsync(array).then(() => {
        checkSorting(array);
        resolve(performance.now() - start);
      });
    });
  });
}

function cpuFloat64Array(width: number) {
  const array = new Float64Array(Array.from(Array((width * width) / 2), () => Math.random() - 0.5));
  let start = performance.now();
  array.sort((a, b) => a - b);
  return performance.now() - start;
}

async function prebenchWarmup() {
  index.initializeShaders();
  gpuFloat64Array(widths[0]);
  await gpuFloat64ArrayAsync(widths[0]);
  cpuFloat64Array(widths[0]);
}

function integerWithCommas(x: number) {
  return Math.round(x)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export async function startBenchmarking() {
  if (!benchmarking) {
    benchmarking = true;
    results.fill("pending");
    if (true) {
      await prebenchWarmup();
    }
    if (true) {
      for (let i = 0; i < widths.length; i++) {
        const n = gpuFloat64Array(widths[i]);
        results[i + 0 * widths.length] = `${integerWithCommas(n)}ms`;
        await new Promise(fn => setTimeout(fn, 500));
      }
    }
    if (true) {
      for (let i = 0; i < widths.length; i++) {
        const n = await gpuFloat64ArrayAsync(widths[i]);
        results[i + 1 * widths.length] = `${integerWithCommas(n)}ms`;
        await new Promise(fn => setTimeout(fn, 500));
      }
    }
    if (true) {
      for (let i = 0; i < widths.length; i++) {
        const n = cpuFloat64Array(widths[i]);
        results[i + 2 * widths.length] = `${integerWithCommas(n)}ms`;
        await new Promise(fn => setTimeout(fn, 500));
      }
    }
    benchmarking = false;
  }
}

export function getBenchmarkText() {
  return `‎‎‎
           32,768
gpu.sort            ${results[0]}
gpu.sortAsync       ${results[5]}
Float64Array.sort   ${results[10]}

           131,072
gpu.sort            ${results[1]}
gpu.sortAsync       ${results[6]}
Float64Array.sort   ${results[11]}

           524,288
gpu.sort            ${results[2]}
gpu.sortAsync       ${results[7]}
Float64Array.sort   ${results[12]}

          2,097,152
gpu.sort            ${results[3]}
gpu.sortAsync       ${results[8]}
Float64Array.sort   ${results[13]}

          8,388,608
gpu.sort            ${results[4]}
gpu.sortAsync       ${results[9]}
Float64Array.sort   ${results[14]}
	`.trim();
}

export default {
  startBenchmarking,
  getBenchmarkText,
  isBenchmarking: () => benchmarking
};
