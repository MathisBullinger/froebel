import type { λ } from "./types.ts";

const { performance } = globalThis;
export const cancel = Symbol("throttle.cancel");

/**
 * Create a throttled function that invokes `fun` at most every `ms` milliseconds.
 *
 * `fun` is invoked with the last arguments passed to the throttled function.
 *
 * Calling `[throttle.cancel]()` on the throttled function will cancel the currently
 * scheduled invocation.
 */
const throttle = Object.assign(
  (fun: λ, ms: number, { leading = true, trailing = true } = {}) => {
    let toId: any;
    let lastInvoke = -Infinity;
    let lastArgs: any[] | undefined;

    const invoke = () => {
      lastInvoke = performance.now();
      toId = undefined;
      fun(...lastArgs!);
    };

    return Object.assign(
      (...args: any[]) => {
        if (!leading && !trailing) return;
        lastArgs = args;
        const dt = performance.now() - lastInvoke;

        if (dt >= ms && toId === undefined && leading) invoke();
        else if (toId === undefined && trailing) {
          toId = setTimeout(invoke, dt >= ms ? ms : ms - dt);
        }
      },
      { [cancel]: () => clearTimeout(toId) },
    );
  },
  { cancel },
) as
  & (<T extends λ>(
    fun: T,
    ms: number,
    opts?: { leading?: boolean; trailing: boolean },
  ) => λ<Parameters<T>, void> & { [cancel](): void })
  & {
    cancel: typeof cancel;
  };

export default throttle;
