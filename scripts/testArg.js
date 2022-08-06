module.exports.arg = (target = {}) =>
  new Proxy(target, {
    get(_, prop) {
      if (prop === Symbol.toPrimitive) return () => {};
      if (prop in new String(" ")) return " "[prop];
      if (prop in []) return [][prop];

      return target;
    },
  });
