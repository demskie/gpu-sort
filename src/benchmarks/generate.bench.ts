import * as gpu from "gpu-compute";
import * as index from "../index";
import * as shared from "../shared";
import * as sort from "../shaders/bitonicsort/bitonicsort";

index.precompile();

const cache = new Uint8Array(4096 * 4096 * 4);

export default function* generateBenchmarkText() {
  let i = 0;
  const widthArr = [256, 512, 1024, 2048, 4096];
  const funcArr = [emptyBitonicSort, sortUint32Array, cpuFloat32Array];
  const results = new Array(widthArr.length * 3).fill("pending");
  const getString = () =>
    `
dimensions:             256 x 256
gpu.sortEmpty           ${results[0]}
gpu.sortUint32Array     ${results[1]}
Float32Array.sort()     ${results[2]}

dimensions:             512 x 512
gpu.sortEmpty           ${results[3]}
gpu.sortUint32Array     ${results[4]}
Float32Array.sort()     ${results[5]}

dimensions:             1024 x 1024
gpu.sortEmpty           ${results[6]}
gpu.sortUint32Array     ${results[7]}
Float32Array.sort()     ${results[8]}

dimensions:             2048 x 2048
gpu.sortEmpty           ${results[9]}
gpu.sortUint32Array     ${results[10]}
Float32Array.sort()     ${results[11]}

dimensions:             4096 x 4096
gpu.sortEmpty           ${results[12]}
gpu.sortUint32Array     ${results[13]}
Float32Array.sort()     ${results[14]}
		`.trim();
  yield getString();
  for (var width of widthArr.values()) {
    for (var fn of funcArr.values()) {
      results[i++] = `${fn(width).toLocaleString("en")}ms`;
      yield getString();
    }
  }
}

export function isSorted(array: ArrayLike<number>) {
  const limit = array.length - 1;
  for (let i = 0; i < limit; i++) {
    const current = array[i],
      next = array[i + 1];
    if (current > next) {
      throw new Error(`index:${i} (${current} > ${next})`);
      return false;
    }
  }
  return true;
}

function randomizeBytes(bytes: Uint8Array) {
  for (var i = 0; i < bytes.length; i++) {
    bytes[i] = Math.floor(Math.random() * 256);
  }
}

export function emptyBitonicSort(width: number) {
  let start = performance.now();
  let bytes = new gpu.RenderTarget(width);
  let params = sort.getParameters("Uint32Array");
  if (!shared.isLittleEndian || params.mode !== sort.TRANSFORM_MODE.PASSTHROUGH)
    bytes.compute(params.transformShader, {
      u_bytes: bytes,
      u_width: bytes.width,
      u_mode: params.mode,
      u_endianness: shared.isLittleEndian ? 0 : 1
    });
  let uniforms = sort.calculateBitonicUniforms(bytes.width);
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
  bytes.readSomePixels(0, 0, 1, 0);
  let elapsed = performance.now() - start;
  console.log(`gpu.sortEmpty\t\t${elapsed.toLocaleString("en")}ms`);
  return elapsed;
}

export function sortUint32Array(width: number) {
  let slice = new Uint32Array(cache.subarray(0, width * width * 4).buffer);
  let start = performance.now();
  index.sortUint32Array(new Uint32Array(slice.buffer));
  let elapsed = performance.now() - start;
  console.log(`gpu.sortUint32Array\t${elapsed.toLocaleString("en")}ms`);
  if (!isSorted(new Uint32Array(slice.buffer))) throw new Error("is not sorted");
  randomizeBytes(cache.subarray(0, width * width * 4));
  return elapsed;
}

export function cpuFloat32Array(width: number) {
  let slice = new Float32Array(cache.subarray(0, width * width * 4).buffer);
  let start = performance.now();
  slice.sort((a, b) => a - b);
  let elapsed = performance.now() - start;
  console.log(`Float32Array.sort()\t${elapsed.toLocaleString("en")}ms`);
  if (!isSorted(slice)) throw new Error("is not sorted");
  randomizeBytes(cache.subarray(0, width * width * 4));
  return elapsed;
}
