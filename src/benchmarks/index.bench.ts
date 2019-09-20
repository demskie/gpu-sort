import * as gpu from "gpu-compute";
import * as index from "../index";
import * as shared from "../shared";
import * as sort from "../shaders/bitonicsort/bitonicsort";

// index.setWebGLContext(require("gl")(1, 1) as WebGLRenderingContext);
index.precompile();

for (var width of [256, 512, 1024, 2048, 4096].values()) {
  console.log(`dimensions:\t\t${width} x ${width}`);
  emptyBitonicSort(width);
  sortUint32Array(width);
  cpuFloat32Array(width);
  cpuArray(width);
}

export function isSorted(array: ArrayLike<number>) {
  const limit = array.length - 1;
  for (let i = 0; i < limit; i++) {
    const current = array[i],
      next = array[i + 1];
    if (current > next) {
      return false;
    }
  }
  return true;
}

export function emptyBitonicSort(width: number) {
  const start = Date.now();
  const bytes = new gpu.RenderTarget(width);
  const params = sort.getParameters("Uint32Array");
  if (!shared.isLittleEndian || params.mode !== sort.TRANSFORM_MODE.PASSTHROUGH)
    bytes.compute(params.transformShader, {
      u_bytes: bytes,
      u_width: bytes.width,
      u_mode: params.mode,
      u_endianness: shared.isLittleEndian ? 0 : 1
    });
  const uniforms = sort.calculateBitonicUniforms(bytes.width);
  for (var i = 0; i < uniforms.length; i++) {
    bytes.compute(params.sortShader, {
      u_bytes: bytes,
      u_width: bytes.width,
      u_blockSizeX: uniforms[i].blockSizeX,
      u_blockSizeY: uniforms[i].blockSizeY,
      u_regionSizeX: uniforms[i].regionSizeX,
      u_regionSizeY: uniforms[i].regionSizeY
    });
  }
  if (!shared.isLittleEndian || params.mode !== sort.TRANSFORM_MODE.PASSTHROUGH)
    bytes.compute(params.untransformShader, {
      u_bytes: bytes,
      u_width: bytes.width,
      u_mode: params.mode,
      u_endianness: shared.isLittleEndian ? 0 : 1
    });
  bytes.readSomePixels(0, 0, 0, 1);
  const elapsed = Date.now() - start;
  console.log(`gpu.sortEmpty\t\t${elapsed.toLocaleString("en")}ms`);
  return elapsed;
}

export function sortUint32Array(width: number) {
  const gpuUint32Array = new Uint32Array(width * width);
  gpuUint32Array.set(Array.from(Array(width * width), () => Math.random() * 0xffffffff));
  const start = Date.now();
  index.sortUint32Array(gpuUint32Array);
  const elapsed = Date.now() - start;
  console.log(`gpu.sortUint32Array\t${elapsed.toLocaleString("en")}ms`);
  if (!isSorted(gpuUint32Array)) throw new Error("is not sorted");
  return elapsed;
}

export function cpuFloat32Array(width: number) {
  const cpuFloat32Array = new Float32Array(width * width);
  cpuFloat32Array.set(Array.from(Array(width * width), () => Math.random() * 0xffffffff));
  const start = Date.now();
  cpuFloat32Array.sort((a, b) => a - b);
  const elapsed = Date.now() - start;
  console.log(`Float32Array.sort()\t${elapsed.toLocaleString("en")}ms`);
  if (!isSorted(cpuFloat32Array)) throw new Error("is not sorted");
  return elapsed;
}

export function cpuArray(width: number) {
  const cpuArray = Array.from(Array(width * width), () => Math.random() * 0xffffffff);
  const start = Date.now();
  cpuArray.sort((a, b) => a - b);
  const elapsed = Date.now() - start;
  console.log(`Array.sort()\t\t${elapsed.toLocaleString("en")}ms\n`);
  if (!isSorted(cpuArray)) throw new Error("is not sorted");
  return elapsed;
}
