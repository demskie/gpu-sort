import * as index from "../index";

index.precompileAll();

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

export default function* generateBenchmarkText() {
  let i = 0;
  const widthArr = [256, 512, 1024, 2048, 4096];
  const funcArr = [gpuFloat64Array, cpuFloat64Array];
  const results = new Array(widthArr.length * 3).fill("pending");
  const getString = () =>
    `
dimensions:         256 x 256
gpuFloat64Array     ${results[0]}
cpuFloat64Array     ${results[1]}

dimensions:         512 x 512
gpuFloat64Array     ${results[2]}
cpuFloat64Array     ${results[3]}

dimensions:         1024 x 1024
gpuFloat64Array     ${results[4]}
cpuFloat64Array     ${results[5]}

dimensions:         2048 x 2048
gpuFloat64Array     ${results[6]}
cpuFloat64Array     ${results[7]}

dimensions:         4096 x 4096
gpuFloat64Array     ${results[8]}
cpuFloat64Array     ${results[9]}
		`.trim();
  yield new Promise(r => r(getString()));
  for (var width of widthArr.values()) {
    for (var fn of funcArr.values()) {
      yield new Promise(resolve => {
        fn(width).then((result: number) => {
          results[i++] = `${result.toLocaleString("en")}ms`;
          resolve(getString());
        });
      });
    }
  }
}

function checkSorting(array: ArrayLike<number>) {
  return new Promise(resolve => {
    for (let i = 0; i < array.length - 1; i++) {
      if (array[i] > array[i + 1]) {
        throw new Error(`index:${i} (${array[i]} > ${array[i + 1]})`);
      }
    }
    resolve();
  });
}

function randomizeBytes(bytes: Uint8Array) {
  return new Promise(resolve => {
    for (var i = 0; i < bytes.length; i++) {
      bytes[i] = Math.floor(Math.random() * 256);
    }
    resolve();
  });
}

function gpuFloat64Array(width: number) {
  return new Promise(resolve => {
    let elapsed = 0;
    let slice = new Float64Array((width * width) / 2);
    randomizeBytes(new Uint8Array(slice.buffer))
      .then(() => sleep(500))
      .then(() => {
        let start = performance.now();
        index.sortFloat64Array(slice);
        elapsed = performance.now() - start;
      })
      .then(() => sleep(500))
      .then(() => checkSorting(slice))
      .then(() => resolve(elapsed));
  });
}

function cpuFloat64Array(width: number) {
  return new Promise(resolve => {
    let elapsed = 0;
    let slice = new Float64Array((width * width) / 2);
    randomizeBytes(new Uint8Array(slice.buffer))
      .then(() => sleep(500))
      .then(() => {
        let start = performance.now();
        slice.sort((a, b) => a - b);
        elapsed = performance.now() - start;
      })
      .then(() => sleep(500))
      .then(() => checkSorting(slice))
      .then(() => resolve(elapsed));
  });
}
