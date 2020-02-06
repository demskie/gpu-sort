import * as index from "../index";

index.precompileShaders();

let benchmarking = false;
const widths = [256, 512, 1024, 2048, 4096];
const results = new Array(widths.length * 2).fill("pending");

async function gpuFloat64Array(width: number) {
  const slice = new Float64Array(Array.from(Array((width * width) / 2), () => Math.random() - 0.5));
  let start = performance.now();
  await index.sortFloat64ArrayAsync(slice);
  return performance.now() - start;
}

function cpuFloat64Array(width: number) {
  const slice = new Float64Array(Array.from(Array((width * width) / 2), () => Math.random() - 0.5));
  let start = performance.now();
  slice.sort((a, b) => a - b);
  return performance.now() - start;
}

async function startBenchmarking() {
  if (!benchmarking) {
    benchmarking = true;
    results.fill("pending");
    for (let i = 0; i < widths.length; i++) {
      const n = await gpuFloat64Array(widths[i]);
      results[i] = `${n.toLocaleString("en")}ms`;
      await new Promise(fn => setTimeout(fn, 500));
    }
    for (let i = 0; i < widths.length; i++) {
      const n = cpuFloat64Array(widths[i]);
      results[i + widths.length] = `${n.toLocaleString("en")}ms`;
      await new Promise(fn => setTimeout(fn, 500));
    }
    benchmarking = false;
  }
}

function getBenchmarkText() {
  return `
dimensions:         256 x 256
gpuFloat64Array     ${results[0]}
cpuFloat64Array     ${results[5]}

dimensions:         512 x 512
gpuFloat64Array     ${results[1]}
cpuFloat64Array     ${results[6]}

dimensions:         1024 x 1024
gpuFloat64Array     ${results[2]}
cpuFloat64Array     ${results[7]}

dimensions:         2048 x 2048
gpuFloat64Array     ${results[3]}
cpuFloat64Array     ${results[8]}

dimensions:         4096 x 4096
gpuFloat64Array     ${results[4]}
cpuFloat64Array     ${results[9]}
	`.trim();
}

export default {
  startBenchmarking,
  getBenchmarkText,
  isBenchmarking: () => benchmarking
};
