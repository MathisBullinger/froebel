import type { MakeProm, λ } from "./types.ts";
import noop from "./noop.ts";

/**
 * Creates a `queue` function that accepts a function as it's only parameter.
 * When `queue` is invoked, the passed in function is executed after the last
 * function passed to `queue` has finished executing. The `queue` function
 * returns the result of the passed in function asynchronously.
 *
 * Reading `queue.done` is `true` if no functions are currently executing /
 * scheduled and otherwise a promise that resolves once the last function has
 * stopped executing and no futher functions are queued.
 *
 * @example
 * ```
 * const queue = createQueue()
 *
 * queue(async () => {
 *   console.log('start a')
 *   await delay()
 *   return 'end a'
 * }).then(console.log)
 *
 * queue(async () => {
 *   console.log('start b')
 *   await delay()
 *   return 'end b'
 * }).then(console.log)
 *
 * queue(async () => {
 *   console.log('start c')
 *   await delay()
 *   return 'end c'
 * }).then(console.log)
 *
 * await queue.done
 *
 * // start a
 * // end a
 * // start b
 * // end b
 * // start c
 * // end c
 * ```
 */
const createQueue = (): Queue => {
  let last: Promise<unknown> | null = null;

  const queued = (fun: λ) =>
    last = (last ?? Promise.resolve()).catch(noop).then(fun).finally(
      () => {
        last = null;
      },
    );

  return Object.defineProperty(queued, "done", {
    get: () => last?.catch(noop).then(noop) ?? true,
  }) as Queue;
};

export default createQueue;

type Queue = (<T extends λ<[], unknown>>(fun: T) => MakeProm<ReturnType<T>>) & {
  done: Promise<void> | true;
};
