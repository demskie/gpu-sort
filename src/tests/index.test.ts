import * as shared from "../shared";
import * as index from "../index";

(() => {
  const input = new Float32Array(Array.from(Array(256 * 256), () => Math.random() * 0xffffffff));
  index.sortFloat32Array(input);
  if (!shared.isSorted(input)) throw new Error("did not sort properly");
})();

(() => {
  const input = new Float64Array(Array.from(Array(256 * 256), () => Math.random() * 0xffffffff));
  index.sortFloat64Array(input);
  if (!shared.isSorted(input)) throw new Error("did not sort properly");
})();

(() => {
  const input = new Uint32Array(Array.from(Array(256 * 256), () => Math.random() * 0xffffffff));
  index.sortUint32Array(input);
  if (!shared.isSorted(input)) throw new Error("did not sort properly");
})();
