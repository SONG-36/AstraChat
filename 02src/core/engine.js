export class Engine {
  constructor(middlewares = []) {
    this.middlewares = middlewares;
  }

  async run(ctx) {
    let index = -1;

    const dispatch = async (i) => {
      if (i <= index) {
        throw new Error("next() 不能被多次调用");
      }

      index = i;
      const fn = this.middlewares[i];

      if (fn) {
        return await fn.handle(ctx, () => dispatch(i + 1));
      }
    };

    await dispatch(0);
  }
}
