import * as index from "../index";

beforeAll(() => {
  index.setWebGLContext(require("gl")(1, 1));
});

test("testFloat32", () => {
  let n = 123 * 321;
  let i = n - n / 2;
  let alpha = new Float32Array(Array.from(Array(n), () => --i));
  let bravo = Float32Array.from(alpha).sort((a, b) => a - b);
  index.sortFloat32Array(alpha);
  if (alpha.toString() !== bravo.toString()) throw new Error("did not sort properly");
});

test("testInt32", () => {
  let n = 123 * 321;
  let i = n - n / 2;
  let alpha = new Int32Array(Array.from(Array(n), () => --i));
  let bravo = Int32Array.from(alpha).sort((a, b) => a - b);
  index.sortInt32Array(alpha);
  if (alpha.toString() !== bravo.toString()) throw new Error("did not sort properly");
});

test("testUint32", () => {
  let n = 123 * 321;
  let i = n;
  let alpha = new Uint32Array(Array.from(Array(n), () => --i));
  let bravo = Uint32Array.from(alpha).sort((a, b) => a - b);
  index.sortUint32Array(alpha);
  if (alpha.toString() !== bravo.toString()) throw new Error("did not sort properly");
});

test("testFloat64", () => {
  let n = 123 * 321;
  let i = n - n / 2;
  let alpha = new Float64Array(Array.from(Array(n), () => --i));
  let bravo = Float64Array.from(alpha).sort((a, b) => a - b);
  console.log(alpha);
  index.sortFloat64Array(alpha);
  console.log(alpha);
  if (alpha.toString() !== bravo.toString()) throw new Error("did not sort properly");
});

test("testBigInt64Array", () => {
  let n = 123 * 321;
  let i = Math.floor(n - n / 2);
  let alpha = new BigInt64Array(Array.from(Array(n), () => BigInt(--i)));
  let bravo = BigInt64Array.from(alpha).sort((a: bigint, b: bigint) => Number(a - b));
  index.sortBigInt64Array(alpha);
  if (alpha.toString() !== bravo.toString()) throw new Error("did not sort properly");
});

test("testBigUint64Array", () => {
  let n = 123 * 321;
  let i = n;
  let alpha = new BigUint64Array(Array.from(Array(n), () => BigInt(--i)));
  let bravo = BigUint64Array.from(alpha).sort((a: bigint, b: bigint) => Number(a - b));
  index.sortBigUint64Array(alpha);
  if (alpha.toString() !== bravo.toString()) throw new Error("did not sort properly");
});
