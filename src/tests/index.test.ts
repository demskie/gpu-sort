import * as shared from "../shared";
import * as index from "../index";

var input;

input = new Float32Array(Array.from(Array(256 * 256), () => Math.random() * 0xffffffff));
index.sortFloat32Array(input);
if (!shared.isSorted(input)) throw new Error("float32array did not sort properly");

// input = new Float64Array(Array.from(Array(256 * 256), () => Math.random() * 0xffffffff));
// index.sortFloat64Array(input);
// if (!shared.isSorted(input)) throw new Error("float64array did not sort properly");
//
// input = new Uint32Array(Array.from(Array(256 * 256), () => Math.random() * 0xffffffff));
// index.sortUint32Array(input);
// if (!shared.isSorted(input)) throw new Error("uint32array did not sort properly");

console.log("tests completed!");
