import { getWebGLContext } from "gpu-compute";

export class Limiter {
  private stopped = false;
  private tally = 0;
  private readonly rate: number;
  private readonly work = [] as (() => void)[];

  constructor(width: number) {
    if (width >= 4096) {
      this.rate = 1;
    } else if (width === 2048) {
      this.rate = 4;
    } else if (width === 1024) {
      this.rate = 16;
    } else {
      this.rate = 128;
    }
    this.executeWork();
  }

  public stop() {
    this.stopped = true;
  }

  private executeWork() {
    this.tally += this.rate;
    if (this.work.length === 0) {
      this.tally = Math.max(this.tally, 1);
      if (!this.stopped) requestAnimationFrame(() => this.executeWork());
      return;
    }
    if (this.tally >= 1) {
      const limit = Math.floor(Math.min(this.work.length, Math.max(this.rate, 1)));
      for (let i = 0; i < limit; i++) this.work[i]();
      this.work.splice(0, limit);
      this.tally -= limit;
    }
    getWebGLContext().flush();
    requestAnimationFrame(() => this.executeWork());
  }

  public addWork(work: () => void) {
    if (this.stopped) throw new Error("limiter has been stopped");
    this.work.push(work);
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
