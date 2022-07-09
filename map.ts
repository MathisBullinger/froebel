type MapFun = {
  <IK, IV, OK, OV>(
    data: Map<IK, IV>,
    callback: (key: IK, value: IV) => [OK, OV],
  ): Map<OK, OV>;
  <T, O>(data: T[], callback: (element: T) => O): O[];
  <T, O>(data: Set<T>, callback: (element: T) => O): Set<O>;
  <
    T extends Record<string | number | symbol, unknown>,
    K extends string | number | symbol,
    V,
  >(
    data: T,
    callback: (key: keyof T, value: T[keyof T]) => [K, V],
  ): Record<K, V>;
};

/**
 * Map over `data`. `data` can be a regular object, a `Map`, a `Set`, or an
 * array.
 *
 * @example
 * ```
 * // -> { a: 1, b: 2 }
 * map({ a: '1', b: '2' }, (key, value) => [key, parseInt(value)])
 * ```
 *
 * @example
 * ```
 * // -> Map([ [2, 1], [4, 3] ])
 * map(new Map([ [1, 2], [3, 4] ]), (key, value) => [key + 1, value - 1])
 * ```
 */
const map: MapFun = (data: any, cb: any): any => {
  if (typeof data !== "object" || data === null) {
    throw new TypeError(`cannot map over ${data}`);
  }

  if (data instanceof Map) {
    return new Map([...data].map(([key, value]) => cb(key, value)));
  }

  if (data instanceof Set) {
    return new Set([...data].map((el) => cb(el)));
  }

  if (Array.isArray(data)) {
    return data.map((el) => cb(el));
  }

  return Object.fromEntries(
    Reflect.ownKeys(data).map((key) => cb(key, (data)[key])),
  );
};

export default map;
