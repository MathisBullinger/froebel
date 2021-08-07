# A strictly typed TypeScript utility library.

This is my (WIP) personal collection of TypeScript helper functions and utilities that
I use across different projects.

Think an opionated version of lodash, but with first-class types.


- __`function`__
    - [ident](#ident)
    - [partial](#partial)
    - [forward](#forward)
    - [callAll](#callAll)
    - [bundle](#bundle)
    - [bundleSync](#bundleSync)
    - [throttle](#throttle)
    - [debounce](#debounce)
- __`promise`__
    - [isPromise](#isPromise)



## Function

### `ident` 
  
```hs
(value: T) => T
```

<sup><sup>_[source](https://github.com/MathisBullinger/snatchblock/blob/main/src/ident.ts#L2)_</sup></sup>

> Identity function.

---

### `partial` 
  
```hs
(fun: T, ...argsLeft: PL) => (...argsRight: PR) => ReturnType<T>
```

<sup><sup>_[source](https://github.com/MathisBullinger/snatchblock/blob/main/src/partial.ts#L17)_</sup></sup>

> Partially apply a function.

#### Example
```ts
const divide = (dividend: number, divisor: number) => dividend / divisor

// (divisor: number) => number
const oneOver = partial(divide, 1)

// prints: 0.25
console.log(oneOver(4))
```

---

### `forward` 
  
```hs
(fun: T, ...argsRight: PR) => (...argsLeft: PL) => ReturnType<T>
```

<sup><sup>_[source](https://github.com/MathisBullinger/snatchblock/blob/main/src/forward.ts#L28)_</sup></sup>

> Given a function and its nth..last arguments, return a function accepting
> arguments 0..n-1.

#### Examples
```ts
const divide = (dividend: number, divisor: number) => dividend / divisor

// (dividend: number) => number
const divideBy2 = partial(divide, 2)

// prints: 0.5
console.log(divideBy2(1))
```

```ts
const fetchUrl = async (protocol: string, domain: string, path: string) =>
  await fetch(`${protocol}://${domain}/${path}`)

const fetchRepo = forward(fetchUrl, 'github.com', 'MathisBullinger/snatchblock')

const viaHTTPS = await fetchRepo('https')
```

---

### `callAll` 
  
```hs
(funs: F, ...args: Parameters<F[0]>) => ReturnType<F[number]>[]
```

<sup><sup>_[source](https://github.com/MathisBullinger/snatchblock/blob/main/src/callAll.ts#L16)_</sup></sup>

> Take a list of functions that accept the same parameters and call them all
> with the provided arguments.

#### Example
```ts
const mult = (a: number, b: number) => a * b
const div  = (a: number, b: number) => a / b

// prints: [8, 2]
console.log( callAll([mult, div], 4, 2) )
```

---

### `bundle` 
  
```hs
(...funs: λ<T>[]) => (...args: T) => Promise<void>
```

<sup><sup>_[source](https://github.com/MathisBullinger/snatchblock/blob/main/src/bundle.ts#L12)_</sup></sup>

> Given a list of functions that accept the same parameters, returns a function
> that takes these parameters and invokes all of the given functions.
> 
> The returned function returns a promise that resolves once all functions
> returned/resolved and rejects if any of the functions throws/rejects - but
> only after all returned promises have been settled.
> 

---

### `bundleSync` 
  
```hs
(...funs: λ<T>[]) => (...args: T) => void
```

<sup><sup>_[source](https://github.com/MathisBullinger/snatchblock/blob/main/src/bundle.ts#L29)_</sup></sup>

> Same as [bundle](#bundle), but return synchronously.
> 
> If any of the functions throws an error synchronously, none of the functions
> after it will be invoked and the error will propagate.
> 

---

### `throttle` 
  
```hs
(fun: T, ms: number, opts: {leading: boolean, trailing: boolean}) => λ<Parameters<T>, void> & {[cancel]: () => void}
```

<sup><sup>_[source](https://github.com/MathisBullinger/snatchblock/blob/main/src/throttle.ts#L14)_</sup></sup>

> Created a throttled function that invokes `fun` at most every `ms` milliseconds.
> 
> `fun` is invoked with the last arguments passed to the throttled function.
> 
> Calling `[throttle.cancel]()` on the throttled function will cancel the currently
> scheduled invocation of `fun`.
> 

---

### `debounce` 
  
```hs
(fun: T, ms: number) => λ<Parameters<T>, void> & {[cancel]: () => void}
```

<sup><sup>_[source](https://github.com/MathisBullinger/snatchblock/blob/main/src/debounce.ts#L14)_</sup></sup>

> Creates a debounced function that delays invoking `fun` until `ms` milliseconds
> have passed since the last invocation of the debounced function.
> 
> `fun` is invoked with the last arguments passed to the debounced function.
> 
> Calling `[debounce.cancel]()` on the debounced function will cancel the currently
> scheduled invocation of `fun`.
> 
## Promise

### `isPromise` 
  
```hs
(value: unknown) => value is Promise<T>
```

<sup><sup>_[source](https://github.com/MathisBullinger/snatchblock/blob/main/src/isPromise.ts#L2)_</sup></sup>

> Checks if its first argument look like a promise.