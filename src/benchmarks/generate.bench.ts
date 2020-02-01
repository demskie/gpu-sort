import * as index from "../index";

index.precompileShaders();

let benchmarking = false;
const timeout = 250;
const widths = [256, 512, 1024, 2048, 4096];
const results = new Array(widths.length * 2).fill("pending");

function gpuFloat64Array(width: number) {
  const slice = new Float64Array(Array.from(Array((width * width) / 2), () => Math.random() - 0.5));
  let start = performance.now();
  index.sortFloat64ArrayAsync(slice, 60);
  return performance.now() - start;
}

function cpuFloat64Array(width: number) {
  const slice = new Float64Array(Array.from(Array((width * width) / 2), () => Math.random() - 0.5));
  let start = performance.now();
  slice.sort((a, b) => a - b);
  return performance.now() - start;
}

function startBenchmarking() {
  if (!benchmarking) {
    benchmarking = true;
    results.fill("pending");
    const callback = (i: number) => {
      results[2 * i + 0] = `${gpuFloat64Array(widths[i]).toLocaleString("en")}ms`;
      setTimeout(() => otherCallback(i), timeout);
    };
    const otherCallback = (i: number) => {
      results[2 * i + 1] = `${cpuFloat64Array(widths[i]).toLocaleString("en")}ms`;
      if (i + 1 < widths.length) {
        setTimeout(() => callback(i + 1), timeout);
      } else {
        benchmarking = false;
      }
    };
    callback(0);
  }
}

function getBenchmarkText() {
  return `
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
}

export default {
  startBenchmarking,
  getBenchmarkText,
  isBenchmarking: () => benchmarking
};
