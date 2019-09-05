export function fixedWidth(s: string, n: number) {
  return "    " + s + " ".repeat(Math.max(0, n - s.length));
}

function numberWithCommas(x: number) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function benchmark(title: string, callback: () => void) {
  var start = Date.now();
  var executions = 0;
  while (Date.now() - start < 1000) {
    callback();
    executions++;
  }
  var opsPerSecond = (1000 / (Date.now() - start)) * executions;
  console.log(`${fixedWidth(title, 30)} ${numberWithCommas(opsPerSecond)} ops/sec`);
}
