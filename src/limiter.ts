export class Limiter {
  private stopped = false;
  private readonly rate: number;
  private readonly work = [] as (() => void)[];

  constructor(width: number) {
    if (width > 4096) {
      this.rate = 1;
    } else if (width === 4096) {
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
    if (this.work.length === 0) {
      if (!this.stopped) requestAnimationFrame(() => this.executeWork());
      return;
    }
    const limit = Math.min(this.work.length, this.rate);
    for (let i = 0; i < limit; i++) this.work[i]();
    this.work.splice(0, limit);
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
