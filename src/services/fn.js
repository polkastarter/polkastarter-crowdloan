export const partial = (fn, ...args) => (...restArgs) => fn.apply(this, args.concat(restArgs))
