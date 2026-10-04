export class Singleton {
  private static instance: any = null

  public static get Instance() {
    return this.getInstance<Singleton>()
  }

  protected static getInstance<T>(): T {
    if (!this.instance) {
      this.instance = new this() as T
    }
    return this.instance as T
  }

  constructor() {

  }
}
