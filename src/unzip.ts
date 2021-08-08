import type { λ } from './types'

type Unzip<T extends unknown[]> = { [I in keyof T]: T[I][] }

const unzip = <T extends unknown[]>(...zipped: [...T][]): Unzip<T> =>
  zipped.reduce((a, c) => c.map((v, i) => [...(a[i] ?? []), v]), [] as any)

export default unzip

export const unzipWith = <
  T extends unknown[],
  U extends {
    [I in keyof T]: λ<[cur: T[I], acc: any]>
  }
>(
  zipped: [...T][],
  ...unzippers: U
): { [I in keyof U]: ReturnType<U[I]> } =>
  zipped.reduce((a, c) => c.map((v, i) => unzippers[i](v, a[i])), [] as any)
