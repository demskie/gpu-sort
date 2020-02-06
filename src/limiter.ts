import { isWebGL2, getWebGLContext } from "gpu-compute";

export class Limiter {
  public syncronizer?: (fn: () => void) => void;
  private time?: number;
  private factor = 4;
  private readonly work = [] as (() => void)[];
  private readonly factors = [] as number[];

  constructor() {
    this.executeWork();
  }

  private updateTimeAndFactor() {
    const date = Date.now();
    if (this.time) {
      const limit = isWebGL2() ? 1000 / 20 : 1000 / 30;
      this.factor = Math.ceil(this.factor * (limit / (date - this.time)));
    }
    this.time = date;
  }

  private executeWork() {
    if (this.work.length === 0) {
      this.time = undefined;
      requestAnimationFrame(() => this.executeWork());
      return;
    }
    let [i, f] = [0, 0];
    while (i < this.work.length && f < this.factor) {
      this.work[i]();
      f += this.factors[i];
      i++;
    }
    getWebGLContext().flush();
    this.work.splice(0, i);
    this.factors.splice(0, i);
    if (!this.syncronizer) {
      requestAnimationFrame(() => {
        this.updateTimeAndFactor();
        this.executeWork();
      });
    } else {
      this.syncronizer(() => {
        this.updateTimeAndFactor();
        this.executeWork();
      });
    }
  }

  public addWork(work: () => void, workFactor?: number) {
    this.work.push(work);
    this.factors.push(Math.max(workFactor ? workFactor : 1, 1));
  }

  public onceFinished(callback: () => void) {
    const check = () => {
      if (!this.work.length) {
        callback();
      } else {
        requestAnimationFrame(() => check());
      }
    };
    check();
  }
}
