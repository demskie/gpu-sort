import * as index from "../index";

beforeAll(() => {
  index.setWebGLContext(require("gl")(1, 1));
});

test("testInt8", () => {
  let n = 123 * 456;
  let alpha = new Int8Array(Array.from(Array(n), () => (Math.random() - 0.5) * 256));
  let bravo = Int8Array.from(alpha).sort((a, b) => a - b);
  index.sort(alpha);
  if (alpha.toString() !== bravo.toString()) throw new Error("did not sort properly");
});

test("testInt8Async", async function() {
  let n = 123 * 456;
  let alpha = new Int8Array(Array.from(Array(n), () => (Math.random() - 0.5) * 256));
  let bravo = Int8Array.from(alpha).sort((a, b) => a - b);
  await index.sortAsync(alpha);
  if (alpha.toString() !== bravo.toString()) throw new Error("did not sort properly");
});

test("testUint8", () => {
  let n = 123 * 456;
  let alpha = new Uint8Array(Array.from(Array(n), () => Math.random() * 256));
  let bravo = Uint8Array.from(alpha).sort((a, b) => a - b);
  index.sort(alpha);
  if (alpha.toString() !== bravo.toString()) throw new Error("did not sort properly");
});

test("testUint8Async", async function() {
  let n = 123 * 456;
  let alpha = new Uint8Array(Array.from(Array(n), () => Math.random() * 256));
  let bravo = Uint8Array.from(alpha).sort((a, b) => a - b);
  await index.sortAsync(alpha);
  if (alpha.toString() !== bravo.toString()) throw new Error("did not sort properly");
});

test("testUint8Clamped", () => {
  let n = 123 * 456;
  let alpha = new Uint8ClampedArray(Array.from(Array(n), () => Math.random() * 256));
  let bravo = Uint8ClampedArray.from(alpha).sort((a, b) => a - b);
  index.sort(alpha);
  if (alpha.toString() !== bravo.toString()) throw new Error("did not sort properly");
});

test("testUint8ClampedAsync", async function() {
  let n = 123 * 456;
  let alpha = new Uint8ClampedArray(Array.from(Array(n), () => Math.random() * 256));
  let bravo = Uint8ClampedArray.from(alpha).sort((a, b) => a - b);
  await index.sortAsync(alpha);
  if (alpha.toString() !== bravo.toString()) throw new Error("did not sort properly");
});

test("testInt16", () => {
  let n = 123 * 456;
  let alpha = new Int16Array(Array.from(Array(n), () => (Math.random() - 0.5) * 65536));
  let bravo = Int16Array.from(alpha).sort((a, b) => a - b);
  index.sort(alpha);
  if (alpha.toString() !== bravo.toString()) throw new Error("did not sort properly");
});

test("testInt16Async", async function() {
  let n = 123 * 456;
  let alpha = new Int16Array(Array.from(Array(n), () => (Math.random() - 0.5) * 65536));
  let bravo = Int16Array.from(alpha).sort((a, b) => a - b);
  await index.sortAsync(alpha);
  if (alpha.toString() !== bravo.toString()) throw new Error("did not sort properly");
});

test("testUint16", () => {
  let n = 123 * 456;
  let alpha = new Uint16Array(Array.from(Array(n), () => Math.random() * 65536));
  let bravo = Uint16Array.from(alpha).sort((a, b) => a - b);
  index.sort(alpha);
  if (alpha.toString() !== bravo.toString()) throw new Error("did not sort properly");
});

test("testUint16Async", async function() {
  let n = 123 * 456;
  let alpha = new Uint16Array(Array.from(Array(n), () => Math.random() * 65536));
  let bravo = Uint16Array.from(alpha).sort((a, b) => a - b);
  await index.sortAsync(alpha);
  if (alpha.toString() !== bravo.toString()) throw new Error("did not sort properly");
});

test("testFloat32", () => {
  let n = 12 * 34;
  let alpha = new Float32Array(Array.from(Array(n), () => Math.random() - 0.5));
  let bravo = Float32Array.from(alpha).sort((a, b) => a - b);
  index.sort(alpha);
  if (alpha.toString() !== bravo.toString()) throw new Error("did not sort properly");
});

test("testFloat32Async", async function() {
  let n = 12 * 34;
  let alpha = new Float32Array(Array.from(Array(n), () => Math.random() - 0.5));
  let bravo = Float32Array.from(alpha).sort((a, b) => a - b);
  await index.sortAsync(alpha);
  if (alpha.toString() !== bravo.toString()) throw new Error("did not sort properly");
});

test("testInt32", () => {
  let n = 12 * 34;
  let alpha = new Int32Array(Array.from(Array(n), () => (Math.random() - 0.5) * 1e6));
  let bravo = Int32Array.from(alpha).sort((a, b) => a - b);
  index.sort(alpha);
  if (alpha.toString() !== bravo.toString()) throw new Error("did not sort properly");
});

test("testInt32Async", async function() {
  let n = 12 * 34;
  let alpha = new Int32Array(Array.from(Array(n), () => (Math.random() - 0.5) * 1e6));
  let bravo = Int32Array.from(alpha).sort((a, b) => a - b);
  await index.sortAsync(alpha);
  if (alpha.toString() !== bravo.toString()) throw new Error("did not sort properly");
});

test("testUint32", () => {
  let n = 12 * 34;
  let alpha = new Uint32Array(Array.from(Array(n), () => Math.random() * 1e6));
  let bravo = Uint32Array.from(alpha).sort((a, b) => a - b);
  index.sort(alpha);
  if (alpha.toString() !== bravo.toString()) throw new Error("did not sort properly");
});

test("testUint32Async", async function() {
  let n = 12 * 34;
  let alpha = new Uint32Array(Array.from(Array(n), () => Math.random() * 1e6));
  let bravo = Uint32Array.from(alpha).sort((a, b) => a - b);
  await index.sortAsync(alpha);
  if (alpha.toString() !== bravo.toString()) throw new Error("did not sort properly");
});

test("testFloat64", () => {
  let n = 12 * 34;
  let alpha = new Float64Array(Array.from(Array(n), () => Math.random() - 0.5));
  let bravo = Float64Array.from(alpha).sort((a, b) => a - b);
  index.sort(alpha);
  if (alpha.toString() !== bravo.toString()) throw new Error("did not sort properly");
});

test("testFloat64Async", async function() {
  let n = 12 * 34;
  let alpha = new Float64Array(Array.from(Array(n), () => Math.random() - 0.5));
  let bravo = Float64Array.from(alpha).sort((a, b) => a - b);
  await index.sortAsync(alpha);
  if (alpha.toString() !== bravo.toString()) throw new Error("did not sort properly");
});

test("testBigInt64Array", () => {
  let n = 12 * 34;
  let alpha = new BigInt64Array(Array.from(Array(n), () => BigInt(Math.floor((Math.random() - 0.5) * 1e6))));
  let bravo = BigInt64Array.from(alpha).sort((a: bigint, b: bigint) => Number(a - b));
  index.sort(alpha);
  if (alpha.toString() !== bravo.toString()) throw new Error("did not sort properly");
});

test("testBigInt64ArrayAsync", async function() {
  let n = 12 * 34;
  let alpha = new BigInt64Array(Array.from(Array(n), () => BigInt(Math.floor((Math.random() - 0.5) * 1e6))));
  let bravo = BigInt64Array.from(alpha).sort((a: bigint, b: bigint) => Number(a - b));
  await index.sortAsync(alpha);
  if (alpha.toString() !== bravo.toString()) throw new Error("did not sort properly");
});

test("testBigUint64Array", () => {
  let n = 12 * 34;
  let alpha = new BigUint64Array(Array.from(Array(n), () => BigInt(Math.floor(Math.random() * 1e6))));
  let bravo = BigUint64Array.from(alpha).sort((a: bigint, b: bigint) => Number(a - b));
  index.sort(alpha);
  if (alpha.toString() !== bravo.toString()) throw new Error("did not sort properly");
});

test("testBigUint64ArrayAsync", async function() {
  let n = 12 * 34;
  let alpha = new BigUint64Array(Array.from(Array(n), () => BigInt(Math.floor(Math.random() * 1e6))));
  let bravo = BigUint64Array.from(alpha).sort((a: bigint, b: bigint) => Number(a - b));
  await index.sortAsync(alpha);
  if (alpha.toString() !== bravo.toString()) throw new Error("did not sort properly");
});
