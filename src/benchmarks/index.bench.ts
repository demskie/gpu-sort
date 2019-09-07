import * as index from "../index";
// import * as Benchmark from "benchmark";

index.precompile();

for (var width of [256, 512, 1024, 2048, 4096].values()) {
  console.log(`dimensions: ${width} x ${width}`);

  var gpuUint32Array = new Uint32Array(width * width);
  gpuUint32Array.set(Array.from(Array(width * width), () => Math.random() * 0xffffffff));

  let start = Date.now();
  index.sortUint32Array(gpuUint32Array);
  console.log(`finished gpu.sortUint32Array() in: \t${Date.now() - start}ms`);

  var gpuFloat32Array = new Float32Array(width * width);
  gpuFloat32Array.set(Array.from(Array(width * width), () => Math.random() * 0xffffffff));

  start = Date.now();
  index.sortFloat32Array(gpuFloat32Array);
  console.log(`finished gpu.sortFloat32Array() in: \t${Date.now() - start}ms`);

  var cpuFloat32Array = new Float32Array(width * width);
  cpuFloat32Array.set(Array.from(Array(width * width), () => Math.random() * 0xffffffff));

  start = Date.now();
  cpuFloat32Array.sort((a, b) => a - b);
  console.log(`finished Float32Array.sort() in: \t${Date.now() - start}ms`);

  var cpuArray = Array.from(Array(width * width), () => Math.random() * 0xffffffff);

  start = Date.now();
  cpuArray.sort((a, b) => a - b);
  console.log(`finished Array.sort() in: \t\t${Date.now() - start}ms\n`);
}

//
// var gpuFloat32Array = new Float32Array(number);
// var cpuFloat32Array = new Float32Array(number);
// var cpuArray = new Array(number);
//
// new Benchmark.Suite("index.bench.ts")
//
//   .add("Float64Array (gpu)", () => {
//     gpuFloat32Array.set(Array.from(Array(number), () => Math.random() * 0xffffffff));
//     index.sortFloat32Array(gpuFloat32Array);
//   })
//
//   .add("Float64Array (cpu)", () => {
//     cpuFloat32Array.set(Array.from(Array(number), () => Math.random() * 0xffffffff));
//     cpuFloat32Array.sort((a, b) => a - b);
//     // cpuFloat64Array.sort();
//   })
//
//   .add("Array (cpu)", () => {
//     cpuArray = Array.from(Array(number), () => Math.random() * 0xffffffff);
//     cpuArray.sort((a, b) => a - b);
//     // cpuFloat64Array.sort();
//   })
//
//   .on("complete", function() {
//     console.log(`'${this.name}' output:`);
//     this.forEach((bench: Benchmark) => {
//       console.log(bench.toString());
//     });
//   })
//
//   .run();
