import { benchmark } from "./benchmark";
import * as index from "../index";

const gpuFloat64Array = Float64Array.from(Array(1024), () => Math.random() * 0xffffffff);
const cpuFloat64Array = Float64Array.from(Array(1024), () => Math.random() * 0xffffffff);

benchmark("Float64Array (gpu) 1024x1024", () => {
  index.sortFloat64Array(gpuFloat64Array);
});

benchmark("Float64Array (cpu) 1024x1024", () => {
  cpuFloat64Array.sort((a, b) => a - b);
});
