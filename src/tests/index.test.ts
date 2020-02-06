import * as index from "../index";

beforeAll(() => {
  index.setWebGLContext(require("gl")(1, 1));
});

// https://www.khronos.org/opengl/wiki/Pixel_Buffer_Object
// https://github.com/uber/luma.gl/pull/450
// https://github.com/KhronosGroup/WebGL/blob/master/sdk/tests/conformance2/reading/read-pixels-into-pixel-pack-buffer.html
// https://stackoverflow.com/questions/43530082/how-can-i-upload-a-texture-in-webgl2-using-a-pixel-buffer-object

test("testFloat32", () => {
  let n = 12 * 34567;
  let alpha = new Float32Array(Array.from(Array(n), () => Math.random() - 0.5));
  let bravo = Float32Array.from(alpha).sort((a, b) => a - b);
  index.sortFloat32Array(alpha);
  if (alpha.toString() !== bravo.toString()) throw new Error("did not sort properly");
});

test("testFloat32Async", async function() {
  let n = 12 * 34567;
  let alpha = new Float32Array(Array.from(Array(n), () => Math.random() - 0.5));
  let bravo = Float32Array.from(alpha).sort((a, b) => a - b);
  await index.sortFloat32ArrayAsync(alpha);
  if (alpha.toString() !== bravo.toString()) throw new Error("did not sort properly");
});

test("testInt32", () => {
  let n = 12 * 34567;
  let alpha = new Int32Array(Array.from(Array(n), () => (Math.random() - 0.5) * 1e6));
  let bravo = Int32Array.from(alpha).sort((a, b) => a - b);
  index.sortInt32Array(alpha);
  if (alpha.toString() !== bravo.toString()) throw new Error("did not sort properly");
});

test("testInt32Async", async function() {
  let n = 12 * 34567;
  let alpha = new Int32Array(Array.from(Array(n), () => (Math.random() - 0.5) * 1e6));
  let bravo = Int32Array.from(alpha).sort((a, b) => a - b);
  await index.sortInt32ArrayAsync(alpha);
  if (alpha.toString() !== bravo.toString()) throw new Error("did not sort properly");
});

test("testUint32", () => {
  let n = 12 * 34;
  let alpha = new Uint32Array(Array.from(Array(n), () => Math.random() * 1e6));
  let bravo = Uint32Array.from(alpha).sort((a, b) => a - b);
  index.sortUint32Array(alpha);
  if (alpha.toString() !== bravo.toString()) throw new Error("did not sort properly");
});

test("testUint32Async", async function() {
  let n = 12 * 34;
  let alpha = new Uint32Array(Array.from(Array(n), () => Math.random() * 1e6));
  let bravo = Uint32Array.from(alpha).sort((a, b) => a - b);
  await index.sortUint32ArrayAsync(alpha);
  if (alpha.toString() !== bravo.toString()) throw new Error("did not sort properly");
});

test("testFloat64", () => {
  let n = 12 * 34;
  let alpha = new Float64Array(Array.from(Array(n), () => Math.random() - 0.5));
  let bravo = Float64Array.from(alpha).sort((a, b) => a - b);
  index.sortFloat64Array(alpha);
  if (alpha.toString() !== bravo.toString()) throw new Error("did not sort properly");
});

test("testFloat64Async", async function() {
  let n = 12 * 34;
  let alpha = new Float64Array(Array.from(Array(n), () => Math.random() - 0.5));
  let bravo = Float64Array.from(alpha).sort((a, b) => a - b);
  await index.sortFloat64ArrayAsync(alpha);
  if (alpha.toString() !== bravo.toString()) throw new Error("did not sort properly");
});

test("testBigInt64Array", () => {
  let n = 12 * 34;
  let alpha = new BigInt64Array(Array.from(Array(n), () => BigInt(Math.floor((Math.random() - 0.5) * 1e6))));
  let bravo = BigInt64Array.from(alpha).sort((a: bigint, b: bigint) => Number(a - b));
  index.sortBigInt64Array(alpha);
  if (alpha.toString() !== bravo.toString()) throw new Error("did not sort properly");
});

test("testBigInt64ArrayAsync", async function() {
  let n = 12 * 34;
  let alpha = new BigInt64Array(Array.from(Array(n), () => BigInt(Math.floor((Math.random() - 0.5) * 1e6))));
  let bravo = BigInt64Array.from(alpha).sort((a: bigint, b: bigint) => Number(a - b));
  await index.sortBigInt64ArrayAsync(alpha);
  if (alpha.toString() !== bravo.toString()) throw new Error("did not sort properly");
});

test("testBigUint64Array", () => {
  let n = 12 * 34;
  let alpha = new BigUint64Array(Array.from(Array(n), () => BigInt(Math.floor(Math.random() * 1e6))));
  let bravo = BigUint64Array.from(alpha).sort((a: bigint, b: bigint) => Number(a - b));
  index.sortBigUint64Array(alpha);
  if (alpha.toString() !== bravo.toString()) throw new Error("did not sort properly");
});

test("testBigUint64ArrayAsync", async function() {
  let n = 12 * 34;
  let alpha = new BigUint64Array(Array.from(Array(n), () => BigInt(Math.floor(Math.random() * 1e6))));
  let bravo = BigUint64Array.from(alpha).sort((a: bigint, b: bigint) => Number(a - b));
  await index.sortBigUint64ArrayAsync(alpha);
  if (alpha.toString() !== bravo.toString()) throw new Error("did not sort properly");
});
