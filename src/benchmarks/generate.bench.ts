import * as gpu from "gpu-compute";
import * as index from "../index";
import * as shared from "../shared";
import * as sort from "../shaders/bitonicsort/bitonicsort";

index.precompile();

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

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

function emptyBitonicSort(width: number) {
  return new Promise(resolve => {
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
    resolve(elapsed);
  });
}

function sortUint32Array(width: number) {
  return new Promise(resolve => {
    let elapsed = 0;
    let slice = new Uint32Array(width * width);
    randomizeBytes(new Uint8Array(slice.buffer))
      .then(() => sleep(500))
      .then(() => {
        let start = performance.now();
        index.sortUint32Array(slice);
        elapsed = performance.now() - start;
      })
      .then(() => sleep(500))
      .then(() => checkSorting(slice))
      .then(() => resolve(elapsed));
  });
}

function cpuFloat32Array(width: number) {
  return new Promise(resolve => {
    let elapsed = 0;
    let slice = new Float32Array(width * width);
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
