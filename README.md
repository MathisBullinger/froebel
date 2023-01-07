# Froebel - a strictly typed TypeScript utility library.

This is my (WIP) personal collection of TypeScript helper functions and utilities that
I use across different projects. 
Think an opinionated version of lodash, but with first-class types.

If you have an idea for a utility that might make a good addition to this collection,
please open an issue and suggest its inclusion.

Runs in Deno, Node.js, and the Browser. Get it from [deno.land](https://deno.land/x/froebel@v0.23.1) 
or [npm](https://www.npmjs.com/package/froebel).

## Installation

### Using npm

```shell
npm install froebel
```

and — assuming a module-compatible system like webpack — import as:

```ts
import { someUtility } from 'froebel';
// you can also import the utility you need directly:
import memoize from 'froebel/memoize';
```

### Using Deno

```ts
import { someUtility } from "https://deno.land/x/froebel@v0.23.1/mod.ts";
// or import just the utility you need:
import memoize from "https://deno.land/x/froebel@v0.23.1/memoize.ts"
```

---

## Available Utilities

Each category also has a file exporting only the utilities in that category, so
if you want to only import utilities from one category, you could import them as

```ts
import { throttle, debounce } from "froebel/function";
```

A few utils are exported from multiple categories but will only be listed here
once. For example `isPromise` is exported from both the `promise` and the 
`predicate` category.

### Table of Contents



- __`function`__
    - [ident](#ident)
    - [noop](#noop)
    - [partial](#partial)
    - [forward](#forward)
    - [unary](#unary)
    - [callAll](#callall)
    - [pipe](#pipe)
    - [applyPipe](#applypipe)
    - [bundle](#bundle)
    - [bundleSync](#bundlesync)
    - [nullishChain](#nullishchain)
    - [asyncNullishChain](#asyncnullishchain)
    - [throttle](#throttle)
    - [debounce](#debounce)
    - [memoize](#memoize)
    - [limitInvocations](#limitinvocations)
    - [once](#once)
- __`list`__
    - [atWrap](#atwrap)
    - [zip](#zip)
    - [zipWith](#zipwith)
    - [unzip](#unzip)
    - [unzipWith](#unzipwith)
    - [batch](#batch)
    - [partition](#partition)
    - [shuffle](#shuffle)
    - [shuffleInPlace](#shuffleinplace)
    - [take](#take)
    - [range](#range)
    - [numberRange](#numberrange)
    - [alphaRange](#alpharange)
- __`iterable`__
    - [repeat](#repeat)
    - [take](#take)
- __`object`__
    - [pick](#pick)
    - [omit](#omit)
    - [map](#map)
- __`path`__
    - [select](#select)
- __`equality`__
    - [oneOf](#oneof)
    - [equal](#equal)
    - [clone](#clone)
    - [merge](#merge)
- __`promise`__
    - [promisify](#promisify)
    - [createQueue](#createqueue)
    - [isPromise](#ispromise)
    - [isNotPromise](#isnotpromise)
- __`predicate`__
    - [truthy](#truthy)
    - [falsy](#falsy)
    - [nullish](#nullish)
    - [notNullish](#notnullish)
    - [isFulfilled](#isfulfilled)
    - [isRejected](#isrejected)
- __`string`__
    - [prefix](#prefix)
    - [suffix](#suffix)
    - [surround](#surround)
    - [capitalize](#capitalize)
    - [uncapitalize](#uncapitalize)
    - [upper](#upper)
    - [lower](#lower)
    - [snake](#snake)
    - [kebab](#kebab)
    - [camel](#camel)
    - [pascal](#pascal)
    - [screamingSnake](#screamingsnake)
    - [transformCase](#transformcase)
- __`math`__
    - [clamp](#clamp)
- __`data structures`__
    - [BiMap](#bimap)
    - [SortedArray](#sortedarray)
    - [SortedMap](#sortedmap)



## Function

#### `ident` 
  
```hs
(value: T) => T
```

<sup><sup>_[source](https://github.com/MathisBullinger/froebel/blob/main/ident.ts#L2)_ | _[tests](https://github.com/MathisBullinger/froebel/blob/main/ident.test.ts)_</sup></sup>

> Identity function.


#### Import

```ts
/* Node: */  import ident from "froebel/ident";
/* Deno: */  import ident from "https://deno.land/x/froebel@v0.23.1/ident.ts";
```




---

#### `noop` 
  
```hs
() => void
```

<sup><sup>_[source](https://github.com/MathisBullinger/froebel/blob/main/noop.ts#L1)_ | _[tests](https://github.com/MathisBullinger/froebel/blob/main/noop.test.ts)_</sup></sup>




#### Import

```ts
/* Node: */  import noop from "froebel/noop";
/* Deno: */  import noop from "https://deno.land/x/froebel@v0.23.1/noop.ts";
```




---

#### `partial` 
  
```hs
(fun: T, ...argsLeft: PL) => (...argsRight: PR) => ReturnType<T>
```

<sup><sup>_[source](https://github.com/MathisBullinger/froebel/blob/main/partial.ts#L17)_ | _[tests](https://github.com/MathisBullinger/froebel/blob/main/partial.test.ts)_</sup></sup>

> Partially apply a function.


#### Import

```ts
/* Node: */  import partial from "froebel/partial";
/* Deno: */  import partial from "https://deno.land/x/froebel@v0.23.1/partial.ts";
```




#### Example
```ts
const divide = (dividend: number, divisor: number) => dividend / divisor

// (divisor: number) => number
const oneOver = partial(divide, 1)

// prints: 0.25
console.log(oneOver(4))
```

---

#### `forward` 
  
```hs
(fun: T, ...argsRight: PR) => (...argsLeft: PL) => ReturnType<T>
```

<sup><sup>_[source](https://github.com/MathisBullinger/froebel/blob/main/forward.ts#L28)_ | _[tests](https://github.com/MathisBullinger/froebel/blob/main/forward.test.ts)_</sup></sup>

> Given a function and its nth..last arguments, return a function accepting
> arguments 0..n-1.


#### Import

```ts
/* Node: */  import forward from "froebel/forward";
/* Deno: */  import forward from "https://deno.land/x/froebel@v0.23.1/forward.ts";
```




#### Examples
```ts
const divide = (dividend: number, divisor: number) => dividend / divisor

// (dividend: number) => number
const divideBy2 = forward(divide, 2)

// prints: 0.5
console.log(divideBy2(1))
```

```ts
const fetchUrl = async (protocol: string, domain: string, path: string) =>
  await fetch(`${protocol}://${domain}/${path}`)

const fetchRepo = forward(fetchUrl, 'github.com', 'MathisBullinger/froebel')

const viaHTTPS = await fetchRepo('https')
```

---

#### `unary` 
  
```hs
(fun: T) => Unary<T>
```

<sup><sup>_[source](https://github.com/MathisBullinger/froebel/blob/main/unary.ts#L15)_ | _[tests](https://github.com/MathisBullinger/froebel/blob/main/unary.test.ts)_</sup></sup>

> Turns `fun` into a unary function (a function that only accepts one
> argument).
> 
> Note: `fun` must accept at least one argument and must not require more than
> one argument.
> 


#### Import

```ts
/* Node: */  import unary from "froebel/unary";
/* Deno: */  import unary from "https://deno.land/x/froebel@v0.23.1/unary.ts";
```




#### Example
```ts
['1', '2', '3'].map(unary(parseInt))  // -> [1, 2, 3]
```

---

#### `callAll` 
  
```hs
(funs: F[], ...args: P) => ReturnTypes<F>
```

<sup><sup>_[source](https://github.com/MathisBullinger/froebel/blob/main/callAll.ts#L16)_ | _[tests](https://github.com/MathisBullinger/froebel/blob/main/callAll.test.ts)_</sup></sup>

> Take a list of functions that accept the same parameters and call them all
> with the provided arguments.


#### Import

```ts
/* Node: */  import callAll from "froebel/callAll";
/* Deno: */  import callAll from "https://deno.land/x/froebel@v0.23.1/callAll.ts";
```




#### Example
```ts
const mult = (a: number, b: number) => a * b
const div  = (a: number, b: number) => a / b

// prints: [8, 2]
console.log( callAll([mult, div], 4, 2) )
```

---

#### `pipe` 
  
```hs
(...funs: T) => PipedFun<T>
```

<sup><sup>_[source](https://github.com/MathisBullinger/froebel/blob/main/pipe.ts#L27)_ | _[tests](https://github.com/MathisBullinger/froebel/blob/main/pipe.test.ts)_</sup></sup>

> Given a list of functions returns a function that will execute the given
> functions one after another, always passing the result of the previous
> function as an argument to the next function.
> 
> If one of the given functions returns a promise, the promise will be resolved
> before being passed to the next function.
> 


#### Import

```ts
/* Node: */  import pipe from "froebel/pipe";
/* Deno: */  import pipe from "https://deno.land/x/froebel@v0.23.1/pipe.ts";
```




#### Example
```ts
const join = (...chars: string[]) => chars.join('')
pipe(join, parseInt)('1', '2', '3')  // -> 123

const square = (n: number) => n ** 2

// this is equivalent to: square(square(square(2)))
pipe(square, square, square)(2)  // -> 256

// also works with promises:
fetchNumber :: async () => Promise<number>
pipe(fetchNumber, n => n.toString())  // async () => Promise<string>
```

---

#### `applyPipe` 
  
```hs
(arg: Parameters<T[0]>[0], ...funs: T) => CheckPipe<T, CarryReturn<ReturnTypes<T>, Parameters<T[0]>>, false>
```

<sup><sup>_[source](https://github.com/MathisBullinger/froebel/blob/main/pipe.ts#L57)_ | _[tests](https://github.com/MathisBullinger/froebel/blob/main/pipe.test.ts)_</sup></sup>

> Like `pipe` but takes an argument as its first parameter and invokes the pipe
> with it.
> 
> Note: unlike in `pipe`, the first function of the pipe must take exactly one
> argument.
> 
> 
> <sub>see [pipe](#pipe)</sub>


#### Import

```ts
/* Node: */  import { applyPipe } from "froebel/pipe";
/* Deno: */  import { applyPipe } from "https://deno.land/x/froebel@v0.23.1/pipe.ts";
```




#### Example
```ts
applyPipe(2, double, square, half)  // -> 8
```

---

#### `bundle` 
  
```hs
(...funs: λ<T>[]) => (...args: T) => Promise<void>
```

<sup><sup>_[source](https://github.com/MathisBullinger/froebel/blob/main/bundle.ts#L12)_ | _[tests](https://github.com/MathisBullinger/froebel/blob/main/bundle.test.ts)_</sup></sup>

> Given a list of functions that accept the same parameters, returns a function
> that takes these parameters and invokes all of the given functions.
> 
> The returned function returns a promise that resolves once all functions
> returned/resolved and rejects if any of the functions throws/rejects - but
> only after all returned promises have been settled.
> 


#### Import

```ts
/* Node: */  import bundle from "froebel/bundle";
/* Deno: */  import bundle from "https://deno.land/x/froebel@v0.23.1/bundle.ts";
```




---

#### `bundleSync` 
  
```hs
(...funs: λ<T>[]) => (...args: T) => void
```

<sup><sup>_[source](https://github.com/MathisBullinger/froebel/blob/main/bundle.ts#L29)_ | _[tests](https://github.com/MathisBullinger/froebel/blob/main/bundle.test.ts)_</sup></sup>

> Same as [bundle](#bundle), but return synchronously.
> 
> If any of the functions throws an error synchronously, none of the functions
> after it will be invoked and the error will propagate.
> 


#### Import

```ts
/* Node: */  import { bundleSync } from "froebel/bundle";
/* Deno: */  import { bundleSync } from "https://deno.land/x/froebel@v0.23.1/bundle.ts";
```




---

#### `nullishChain` 
  
```hs
(...funs: [] | [FF, ...FR[]]) => (...args: Parameters<FF>) => ReturnType<FF> | ReturnType<FR[number]>
```

<sup><sup>_[source](https://github.com/MathisBullinger/froebel/blob/main/nullishChain.ts#L26)_ | _[tests](https://github.com/MathisBullinger/froebel/blob/main/nullishChain.test.ts)_</sup></sup>

> Given a list of functions that accept the same parameters, returns a function
> that given these arguments returns the result of the first function whose
> result is not nullish.
> 
> This is equivalent to chaining together invocations of the passed in
> functions with the given arguments with nullish coalescing _(`??`)_ operators.
> 


#### Import

```ts
/* Node: */  import { nullishChain } from "froebel/nullishChain";
/* Deno: */  import { nullishChain } from "https://deno.land/x/froebel@v0.23.1/nullishChain.ts";
```




#### Example
```ts
const isAdult   = (age: number) => { if (n >= 18) return 'adult' }
const isToddler = (age: number) => { if (n <= 3) return 'toddler' }

const ageGroup = nullishChain(isAdult, isToddler, () => 'child')

// this is functionally equivalent to:
const ageGroup = age => isAdult(age) ?? isToddler(age) ?? 'child'

ageGroup(1)  // prints: 'toddler'
ageGroup(10) // prints: 'child'
ageGroup(50) // prints: 'adult'
```

---

#### `asyncNullishChain` 
  
```hs
(...funs: [] | [FF, ...FR[]]) => (...args: Parameters<FF>) => Promise<PromType<ReturnType<FF>> | PromType<ReturnType<FR[number]>>>
```

<sup><sup>_[source](https://github.com/MathisBullinger/froebel/blob/main/nullishChain.ts#L45)_ | _[tests](https://github.com/MathisBullinger/froebel/blob/main/nullishChain.test.ts)_</sup></sup>

> Same as [nullishChain](#nullishchain) but accept asynchronous functions too.


#### Import

```ts
/* Node: */  import { asyncNullishChain } from "froebel/nullishChain";
/* Deno: */  import { asyncNullishChain } from "https://deno.land/x/froebel@v0.23.1/nullishChain.ts";
```




#### Example
```ts
const readFromCache = (id: string): Resource => { if (id in cache) return cache[id] }
const readFromFile  = (id: string): Resource => { if (fileExists(id)) return readFile(id) }
const fetchFromNet  = async (id: string): Promise<Resource> => await fetch(`someURL/${id}`)

// async (id: string) => Promise<Resource>
const getResource = asyncNullishChain(readFromCache, readFromFile, fetchFromNet)
```

---

#### `throttle` 
  
```hs
(fun: T, ms: number, opts?: {leading: boolean, trailing: boolean}) => λ<Parameters<T>, void> & {[cancel]: () => void}
```

<sup><sup>_[source](https://github.com/MathisBullinger/froebel/blob/main/throttle.ts#L14)_ | _[tests](https://github.com/MathisBullinger/froebel/blob/main/throttle.test.ts)_</sup></sup>

> Create a throttled function that invokes `fun` at most every `ms` milliseconds.
> 
> `fun` is invoked with the last arguments passed to the throttled function.
> 
> Calling `[throttle.cancel]()` on the throttled function will cancel the currently
> scheduled invocation.
> 


#### Import

```ts
/* Node: */  import throttle from "froebel/throttle";
/* Deno: */  import throttle from "https://deno.land/x/froebel@v0.23.1/throttle.ts";
```




---

#### `debounce` 
  
```hs
(fun: T, ms: number) => λ<Parameters<T>, void> & {[cancel]: () => void}
```

<sup><sup>_[source](https://github.com/MathisBullinger/froebel/blob/main/debounce.ts#L14)_ | _[tests](https://github.com/MathisBullinger/froebel/blob/main/debounce.test.ts)_</sup></sup>

> Creates a debounced function that delays invoking `fun` until `ms` milliseconds
> have passed since the last invocation of the debounced function.
> 
> `fun` is invoked with the last arguments passed to the debounced function.
> 
> Calling `[debounce.cancel]()` on the debounced function will cancel the currently
> scheduled invocation.
> 


#### Import

```ts
/* Node: */  import debounce from "froebel/debounce";
/* Deno: */  import debounce from "https://deno.land/x/froebel@v0.23.1/debounce.ts";
```




---

#### `memoize` 
  
```hs
(fun: T, opt: {limit: number, weak: W, key: (...args: Parameters<T>) => K}) => T & {cache: W extends false ? Map<K, ReturnType<T>> : Cache<K, ReturnType<T>>}
```

<sup><sup>_[source](https://github.com/MathisBullinger/froebel/blob/main/memoize.ts#L70)_ | _[tests](https://github.com/MathisBullinger/froebel/blob/main/memoize.test.ts)_</sup></sup>

> Returns a copy of `fun` that remembers its result for any given arguments and
> only invokes `fun` for unknown arguments.
> 
> The cache key is computed using the `key` function. The default `key`
> function simply stringifies the arguments.
> 
> If `limit` is specified, only the `limit`-last entries are kept in cache.
> 
> The function's cache is available at `memoized.cache`.
> 
> If `opt.weak` is `true`, non-primitive cache keys are stored in a WeakMap.
> This behavior might for example be useful if you want to memoize some
> calculation including a DOM Node without holding on to a reference of that
> node.
> Using weak keys prohibits setting a `limit`.
> 


#### Import

```ts
/* Node: */  import memoize from "froebel/memoize";
/* Deno: */  import memoize from "https://deno.land/x/froebel@v0.23.1/memoize.ts";
```




#### Examples
```ts
const expensiveCalculation = (a: number, b: number) => {
  console.log(`calculate ${a} + ${b}`)
  return a + b
}
const calc = memoize(expensiveCalculation)

console.log( calc(1, 2) )
// calculate 1 + 2
// 3
console.log( calc(20, 5) )
// calculate 20 + 5
// 25
console.log( calc(20, 5) )
// 25
console.log( calc(1, 2) )
// 3

calc.cache.clear()
console.log( calc(1, 2) )
// calculate 1 + 2
// 3
```

```ts
const logIfDifferent = memoize(
  (msg: string) => console.log(msg),
  {
    limit: 1,
    key: msg => msg
  }
)

logIfDifferent('a')
logIfDifferent('a')
logIfDifferent('b')
logIfDifferent('a')

// a
// b
// a
```

---

#### `limitInvocations` 
  
```hs
(fun: T, limit: number, ...funs: ExcS<T>) => T
```

<sup><sup>_[source](https://github.com/MathisBullinger/froebel/blob/main/invoke.ts#L19)_ | _[tests](https://github.com/MathisBullinger/froebel/blob/main/invoke.test.ts)_</sup></sup>

> Returns a version of the function `fun` that can only be invoked `limit`
> times.
> An optional `except` function will be called with the same parameters on any
> additional invocations.
> 
> If `fun` returns anything but `void` (or `Promise<void>`), supplying an
> `except` function is mandatory.
> 
> The `except` function must have the same return type as `fun`, or — if `fun`
> returns a promise — it may return the type that the promise resolves to
> synchronously.
> 
> The `except` function may also throw instead of returning a value.
> 


#### Import

```ts
/* Node: */  import { limitInvocations } from "froebel/invoke";
/* Deno: */  import { limitInvocations } from "https://deno.land/x/froebel@v0.23.1/invoke.ts";
```




---

#### `once` 
  
```hs
(fun: T, ...funs: ExcS<T>) => T
```

<sup><sup>_[source](https://github.com/MathisBullinger/froebel/blob/main/invoke.ts#L40)_ | _[tests](https://github.com/MathisBullinger/froebel/blob/main/invoke.test.ts)_</sup></sup>

> Special case of [limitInvocations](#limitinvocations). `fun` can only be invoked once.
> 
> <sub>see [limitInvocations](#limitinvocations)</sub>


#### Import

```ts
/* Node: */  import { once } from "froebel/invoke";
/* Deno: */  import { once } from "https://deno.land/x/froebel@v0.23.1/invoke.ts";
```



## List

#### `atWrap` 
  
```hs
(arr: T[], i: number) => T
```

<sup><sup>_[source](https://github.com/MathisBullinger/froebel/blob/main/atWrap.ts#L3)_ | _[tests](https://github.com/MathisBullinger/froebel/blob/main/atWrap.test.ts)_</sup></sup>

> Access list at `i % length`. Negative indexes start indexing the last
> element as `[-1]` and wrap around to the back.


#### Import

```ts
/* Node: */  import atWrap from "froebel/atWrap";
/* Deno: */  import atWrap from "https://deno.land/x/froebel@v0.23.1/atWrap.ts";
```




---

#### `zip` 
  
```hs
(...lists: T) => Zip<T>
```

<sup><sup>_[source](https://github.com/MathisBullinger/froebel/blob/main/zip.ts#L16)_ | _[tests](https://github.com/MathisBullinger/froebel/blob/main/zip.test.ts)_</sup></sup>

> Takes multiple lists and returns a list of tuples containing the value in
> each list at the current index. If the lists are of different lengths, the
> returned list of tuples has the length of the shortest passed in list.


#### Import

```ts
/* Node: */  import zip from "froebel/zip";
/* Deno: */  import zip from "https://deno.land/x/froebel@v0.23.1/zip.ts";
```




#### Example
```ts
const pairs = zip([1,2,3], ['a','b','c'])
console.log(pairs) // prints: [[1,'a'], [2,'b'], [3,'c']]
```

---

#### `zipWith` 
  
```hs
(zipper: (...args: {[I in string | number | symbol]: U}) => U, ...lists: T) => U[]
```

<sup><sup>_[source](https://github.com/MathisBullinger/froebel/blob/main/zip.ts#L35)_ | _[tests](https://github.com/MathisBullinger/froebel/blob/main/zip.test.ts)_</sup></sup>

> Same as [zip](#zip) but also takes a `zipper` function, that is called for
> each index with the element at current index in each list as arguments. The
> result of `zipper` is the element at current index in the list returned from
> `zipWith`.


#### Import

```ts
/* Node: */  import { zipWith } from "froebel/zip";
/* Deno: */  import { zipWith } from "https://deno.land/x/froebel@v0.23.1/zip.ts";
```




#### Example
```ts
const sums = zipWith((a,b) => a+b, [1,2,3], [4,5,6])
console.log(sums) // prints: [5,7,9]
```

---

#### `unzip` 
  
```hs
(...zipped: T[][]) => Unzip<T>
```

<sup><sup>_[source](https://github.com/MathisBullinger/froebel/blob/main/unzip.ts#L15)_ | _[tests](https://github.com/MathisBullinger/froebel/blob/main/unzip.test.ts)_</sup></sup>

> Reverse of [zip](#zip). Takes a list of tuples and deconstructs them into
> an array (of length of the tuples length) of lists each containing all the
> elements in all tuples at the lists index.


#### Import

```ts
/* Node: */  import unzip from "froebel/unzip";
/* Deno: */  import unzip from "https://deno.land/x/froebel@v0.23.1/unzip.ts";
```




#### Example
```ts
const [nums, chars] = unzip([1,'a'], [2,'b'], [3,'c'])
console.log(nums)  // prints: [1, 2, 3]
console.log(chars) // prints: ['a','b','c']
```

---

#### `unzipWith` 
  
```hs
(zipped: T[][], ...unzippers: U) => {[I in string | number | symbol]: ReturnType<U[I]>}
```

<sup><sup>_[source](https://github.com/MathisBullinger/froebel/blob/main/unzip.ts#L39)_ | _[tests](https://github.com/MathisBullinger/froebel/blob/main/unzip.test.ts)_</sup></sup>

> Same as [unzip](#unzip) but accepts an `unzipper` function for each tuple
> index. The `unzipper`'s return value is used as the value in the list at
> that index returned from `unzipWith`.
> 
> The `unzipper` takes the current element as its first argument, an
> accumulator as second argument (initially `undefined`) and its return value
> is the accumulator passed into the next invocation.
> 


#### Import

```ts
/* Node: */  import { unzipWith } from "froebel/unzip";
/* Deno: */  import { unzipWith } from "https://deno.land/x/froebel@v0.23.1/unzip.ts";
```




#### Example
```ts
const [nums, str] = unzipWith(
  [ [1,'a'], [2,'b'], [3,'c'] ],
  (n, acc: number[] = []) => [...acc, n],
  (c, str = '') => str + c
)

console.log(nums) // prints: [1, 2, 3]
console.log(str)  // prints: 'abc'
```

---

#### `batch` 
  
```hs
(list: T[], batchSize: number) => T[][]
```

<sup><sup>_[source](https://github.com/MathisBullinger/froebel/blob/main/batch.ts#L14)_ | _[tests](https://github.com/MathisBullinger/froebel/blob/main/batch.test.ts)_</sup></sup>

> Takes a `list` and returns it in multiple smaller lists of the size
> `batchSize`.
> The last batch may be smaller than `batchSize` depending on if `list` size is
> divisible by `batchSize`.


#### Import

```ts
/* Node: */  import batch from "froebel/batch";
/* Deno: */  import batch from "https://deno.land/x/froebel@v0.23.1/batch.ts";
```




#### Example
```ts
batch([1,2,3,4,5], 2)  // -> [ [1,2], [3,4], [5] ]
```

---

#### `partition` 
  
```hs
(list: T[], predicate: (el: T) => el is S) => [S[], Exclude<T, S>[]]
```

<sup><sup>_[source](https://github.com/MathisBullinger/froebel/blob/main/partition.ts#L30)_ | _[tests](https://github.com/MathisBullinger/froebel/blob/main/partition.test.ts)_</sup></sup>

> Takes a `list` and returns a pair of lists containing: the elements that
> match the `predicate` and those that don't, respectively.
> 
> Think of it as `filter`, but the elements that don't pass the filter aren't
> discarded but returned in a separate list instead.
> 


#### Import

```ts
/* Node: */  import partition from "froebel/partition";
/* Deno: */  import partition from "https://deno.land/x/froebel@v0.23.1/partition.ts";
```




#### Example
```ts
const [strings, numbers] = partition(
  ['a', 'b', 1, 'c', 2, 3],
  (el): el is string => typeof el === 'string'
)
// strings: ["a", "b", "c"]
// numbers: [1, 2, 3]
```

---

#### `shuffle` 
  
```hs
(list: T[]) => T[]
```

<sup><sup>_[source](https://github.com/MathisBullinger/froebel/blob/main/shuffle.ts#L5)_ | _[tests](https://github.com/MathisBullinger/froebel/blob/main/shuffle.test.ts)_</sup></sup>

> Shuffles `list` using the Fisher-Yates shuffle algorithm.
> The original `list` is not modified and the shuffled list is returned.


#### Import

```ts
/* Node: */  import shuffle from "froebel/shuffle";
/* Deno: */  import shuffle from "https://deno.land/x/froebel@v0.23.1/shuffle.ts";
```




---

#### `shuffleInPlace` 
  
```hs
(list: unknown[]) => void
```

<sup><sup>_[source](https://github.com/MathisBullinger/froebel/blob/main/shuffle.ts#L16)_ | _[tests](https://github.com/MathisBullinger/froebel/blob/main/shuffle.test.ts)_</sup></sup>

> Same as [shuffle](#shuffle) but shuffles `list` in place.


#### Import

```ts
/* Node: */  import { shuffleInPlace } from "froebel/shuffle";
/* Deno: */  import { shuffleInPlace } from "https://deno.land/x/froebel@v0.23.1/shuffle.ts";
```




---

#### `take` 
  
```hs
(n: number, list: Iterable<T>) => T[]
```

<sup><sup>_[source](https://github.com/MathisBullinger/froebel/blob/main/take.ts#L11)_ | _[tests](https://github.com/MathisBullinger/froebel/blob/main/take.test.ts)_</sup></sup>

> Takes `n` elements from the iterable `list` and returns them as an array.


#### Import

```ts
/* Node: */  import { take } from "froebel/list";
/* Deno: */  import { take } from "https://deno.land/x/froebel@v0.23.1/list.ts";
```




#### Example
```ts
take(5, repeat(1, 2))  // -> [1, 2, 1, 2, 1]
take(3, [1, 2, 3, 4])  // -> [1, 2, 3]
take(3, [1, 2])        // -> [1, 2]
```

---

#### `range` 
  


<sup><sup>_[source](https://github.com/MathisBullinger/froebel/blob/main/range.ts#L66)_ | _[tests](https://github.com/MathisBullinger/froebel/blob/main/range.test.ts)_</sup></sup>

> Creates a range between two values.
> 
> <sub>see [numberRange](#numberrange) and [alphaRange](#alpharange)</sub>


#### Import

```ts
/* Node: */  import range from "froebel/range";
/* Deno: */  import range from "https://deno.land/x/froebel@v0.23.1/range.ts";
```




---

#### `numberRange` 
  
```hs
(start: number, end: number, step: number) => number[]
```

<sup><sup>_[source](https://github.com/MathisBullinger/froebel/blob/main/range.ts#L17)_ | _[tests](https://github.com/MathisBullinger/froebel/blob/main/range.test.ts)_</sup></sup>

> Constructs a numeric between `start` and `end` inclusively.


#### Import

```ts
/* Node: */  import { numberRange } from "froebel/range";
/* Deno: */  import { numberRange } from "https://deno.land/x/froebel@v0.23.1/range.ts";
```




#### Example
```ts
range(2, 6)      // -> [2, 3, 4, 5, 6]
range(8, 9, .3)  // -> [8, 8.3, 8.6, 8.9]
range(3, -2)     // -> [3, 2, 1, 0, -1, -2]
```

---

#### `alphaRange` 
  
```hs
(start: string, end: string) => string[]
```

<sup><sup>_[source](https://github.com/MathisBullinger/froebel/blob/main/range.ts#L43)_ | _[tests](https://github.com/MathisBullinger/froebel/blob/main/range.test.ts)_</sup></sup>

> Constructs a range between characters.


#### Import

```ts
/* Node: */  import { alphaRange } from "froebel/range";
/* Deno: */  import { alphaRange } from "https://deno.land/x/froebel@v0.23.1/range.ts";
```




#### Example
```ts
range('a', 'd')  // -> ['a', 'b', 'c', 'd']
range('Z', 'W')  // -> ['Z', 'Y', 'X', 'W']
```
## Iterable

#### `repeat` 
  
```hs
(...sequence: [T, ...T[]]) => Generator<T>
```

<sup><sup>_[source](https://github.com/MathisBullinger/froebel/blob/main/repeat.ts#L11)_ | _[tests](https://github.com/MathisBullinger/froebel/blob/main/repeat.test.ts)_</sup></sup>

> Returns a generator that repeats `sequence`.


#### Import

```ts
/* Node: */  import repeat from "froebel/repeat";
/* Deno: */  import repeat from "https://deno.land/x/froebel@v0.23.1/repeat.ts";
```




#### Example
```ts
// prints: 1, 2, 3, 1, 2, 3, ...
for (const n of repeat(1, 2, 3))
  console.log(n)
```

---

#### `take` 
  
```hs
(n: number, list: Iterable<T>) => Generator<T>
```

<sup><sup>_[source](https://github.com/MathisBullinger/froebel/blob/main/take.ts#L25)_ | _[tests](https://github.com/MathisBullinger/froebel/blob/main/take.test.ts)_</sup></sup>

> Takes `n` elements from the iterable `list` and returns them as a generator.


#### Import

```ts
/* Node: */  import { take } from "froebel/iterable";
/* Deno: */  import { take } from "https://deno.land/x/froebel@v0.23.1/iterable.ts";
```




#### Example
```ts
[...take(5, repeat(1, 2))]  // -> [1, 2, 1, 2, 1]
[...take(3, [1, 2, 3, 4])]  // -> [1, 2, 3]
[...take(3, [1, 2])]        // -> [1, 2]
```
## Object

#### `pick` 
  
```hs
(obj: T, ...keys: K[]) => Pick<T, K>
```

<sup><sup>_[source](https://github.com/MathisBullinger/froebel/blob/main/pick.ts#L9)_ | _[tests](https://github.com/MathisBullinger/froebel/blob/main/pick.test.ts)_</sup></sup>

> From `obj`, create a new object that only includes `keys`.


#### Import

```ts
/* Node: */  import pick from "froebel/pick";
/* Deno: */  import pick from "https://deno.land/x/froebel@v0.23.1/pick.ts";
```




#### Example
```ts
pick({ a: 1, b: 2, c: 3 }, 'a', 'c') // { a: 1, c: 3 }
```

---

#### `omit` 
  
```hs
(obj: T, ...keys: K[]) => Omit<T, K>
```

<sup><sup>_[source](https://github.com/MathisBullinger/froebel/blob/main/omit.ts#L9)_ | _[tests](https://github.com/MathisBullinger/froebel/blob/main/omit.test.ts)_</sup></sup>

> From `obj`, create a new object that does not include `keys`.


#### Import

```ts
/* Node: */  import omit from "froebel/omit";
/* Deno: */  import omit from "https://deno.land/x/froebel@v0.23.1/omit.ts";
```




#### Example
```ts
omit({ a: 1, b: 2, c: 3 }, 'a', 'c') // { b: 2 }
```

---

#### `map` 
  
```hs
(data: Map<IK, IV>, callback: (key: IK, value: IV) => [OK, OV]) => Map<OK, OV>
```

<sup><sup>_[source](https://github.com/MathisBullinger/froebel/blob/main/map.ts#L34)_ | _[tests](https://github.com/MathisBullinger/froebel/blob/main/map.test.ts)_</sup></sup>

> Map over `data`. `data` can be a regular object, a `Map`, a `Set`, or an
> array.


#### Import

```ts
/* Node: */  import map from "froebel/map";
/* Deno: */  import map from "https://deno.land/x/froebel@v0.23.1/map.ts";
```




#### Examples
```ts
// -> { a: 1, b: 2 }
map({ a: '1', b: '2' }, (key, value) => [key, parseInt(value)])
```

```ts
// -> Map([ [2, 1], [4, 3] ])
map(new Map([ [1, 2], [3, 4] ]), (key, value) => [key + 1, value - 1])
```
## Path

#### `select` 
  
```hs
(obj: T, ...path: P) => PickPath<T, P>
```

<sup><sup>_[source](https://github.com/MathisBullinger/froebel/blob/main/select.ts#L16)_ | _[tests](https://github.com/MathisBullinger/froebel/blob/main/select.test.ts)_</sup></sup>

> Returns the value in `obj` at `path`. If the given path does not exist,
> the symbol `none` is returned.


#### Import

```ts
/* Node: */  import select from "froebel/select";
/* Deno: */  import select from "https://deno.land/x/froebel@v0.23.1/select.ts";
```




#### Example
```ts
// -> 'something'
select(
  { a: { deeply: [{ nested: { object: 'something' } }] } },
  'a', 'deeply', 0, 'nested', 'object'
)
```
## Equality

#### `oneOf` 
  
```hs
(value: T, ...cmps: TT) => value is TT[number]
```

<sup><sup>_[source](https://github.com/MathisBullinger/froebel/blob/main/oneOf.ts#L2)_ | _[tests](https://github.com/MathisBullinger/froebel/blob/main/oneOf.test.ts)_</sup></sup>

> Checks if `v` is one of `cmps`.


#### Import

```ts
/* Node: */  import oneOf from "froebel/oneOf";
/* Deno: */  import oneOf from "https://deno.land/x/froebel@v0.23.1/oneOf.ts";
```




---

#### `equal` 
  
```hs
(a: unknown, b: unknown) => boolean
```

<sup><sup>_[source](https://github.com/MathisBullinger/froebel/blob/main/equal.ts#L9)_ | _[tests](https://github.com/MathisBullinger/froebel/blob/main/equal.test.ts)_</sup></sup>

> Checks if `a` and `b` are structurally equal using the following algorithm:
> 
> - primitives are compared by value
> - functions are compared by reference
> - objects (including arrays) are checked to have the same properties and
>   their values are compared recursively using the same algorithm
> 


#### Import

```ts
/* Node: */  import equal from "froebel/equal";
/* Deno: */  import equal from "https://deno.land/x/froebel@v0.23.1/equal.ts";
```




---

#### `clone` 
  
```hs
(value: T) => T
```

<sup><sup>_[source](https://github.com/MathisBullinger/froebel/blob/main/clone.ts#L15)_ | _[tests](https://github.com/MathisBullinger/froebel/blob/main/clone.test.ts)_</sup></sup>

> Returns a copied version of `value`.
> 
> If `value` is primitive, returns `value`.
> Otherwise, properties of `value` are copied recursively. Only `value`'s own
> enumerable properties are cloned. Arrays are cloned by mapping over their
> elements.
> 
> If a path in `value` references itself or a parent path, then in the
> resulting object that path will also reference the path it referenced in the
> original object (but now in the resuling object instead of the original).
> 


#### Import

```ts
/* Node: */  import clone from "froebel/clone";
/* Deno: */  import clone from "https://deno.land/x/froebel@v0.23.1/clone.ts";
```




---

#### `merge` 
  
```hs
(a: A, b: B) => Merge<A, B>
```

<sup><sup>_[source](https://github.com/MathisBullinger/froebel/blob/main/merge.ts#L76)_ | _[tests](https://github.com/MathisBullinger/froebel/blob/main/merge.test.ts)_</sup></sup>

> Recursively merges `A` and `B`. If a property in `A` and `B` is of a
> different type (i.e. it's not an array, Set, Map, or plain object in both,
> the value from `B` will be used in the result).
> 
> If there are self-references in the cloned values, array / Set items, or Map
> keys or values, they will also be self-referencing in the result.
> 


#### Import

```ts
/* Node: */  import merge from "froebel/merge";
/* Deno: */  import merge from "https://deno.land/x/froebel@v0.23.1/merge.ts";
```



## Promise

#### `promisify` 
  
```hs
(withCallback: T, resultIndex?: N, errorIndex: null | number) => Promisified<T, N>
```

<sup><sup>_[source](https://github.com/MathisBullinger/froebel/blob/main/promisify.ts#L56)_ | _[tests](https://github.com/MathisBullinger/froebel/blob/main/promisify.test.ts)_</sup></sup>

> Turns a function accepting a callback into a function returning a promise.
> You can specify in which parameter (if any) the callback expects to receive
> a result and in which it expects an error.
> Pass `null` to `resultIndex` or `errorIndex` if no result or errors are
> passed to the callback. By default the first argument passed to the callback
> is interpreted as result and none of the arguments as error (if the function
> accepting the callback throws or rejects, that will still result in the
> promisified function rejecting).
> 
> The `callbackFirst` property allows passing additional parameters after the
> callback and `callbackLast` will pass additional parameters before the
> callback.
> 


#### Import

```ts
/* Node: */  import promisify from "froebel/promisify";
/* Deno: */  import promisify from "https://deno.land/x/froebel@v0.23.1/promisify.ts";
```




#### Examples
```ts
const notify = (cb: (msg: string) => void) => { msg('something') }
const waitForMessage = promisify(notify)
await waitForMessage()  // -> 'something'

// here result is passed at index 1 and errors at index 0.
const callbackAPI = (cb: (error?: Error, data?: unknown) => void) => {}
const asyncAPI = promisify(callbackAPI, 1, 0)
```

```ts
const sleep = promisify(setTimeout).callbackFirst
await sleep(200)
```

```ts
const fs = require('node:fs');
const stat = promisify(fs.stat, 1, 0).callbackLast

try {
  const stats = await stat('.');
  console.log(`This directory is owned by ${stats.uid}`);
} catch (err) {
  console.error(err)
}
```

---

#### `createQueue` 
  
```hs
() => Queue
```

<sup><sup>_[source](https://github.com/MathisBullinger/froebel/blob/main/queue.ts#L46)_ | _[tests](https://github.com/MathisBullinger/froebel/blob/main/queue.test.ts)_</sup></sup>

> Creates a `queue` function that accepts a function as it's only parameter.
> When `queue` is invoked, the passed in function is executed after the last
> function passed to `queue` has finished executing. The `queue` function
> returns the result of the passed in function asynchronously.
> 
> Reading `queue.done` is `true` if no functions are currently executing /
> scheduled and otherwise a promise that resolves once the last function has
> stopped executing and no futher functions are queued.
> 


#### Import

```ts
/* Node: */  import createQueue from "froebel/queue";
/* Deno: */  import createQueue from "https://deno.land/x/froebel@v0.23.1/queue.ts";
```




#### Example
```ts
const queue = createQueue()

queue(async () => {
  console.log('start a')
  await delay()
  return 'end a'
}).then(console.log)

queue(async () => {
  console.log('start b')
  await delay()
  return 'end b'
}).then(console.log)

queue(async () => {
  console.log('start c')
  await delay()
  return 'end c'
}).then(console.log)

await queue.done

// start a
// end a
// start b
// end b
// start c
// end c
```

---

#### `isPromise` 
  
```hs
(value: unknown) => value is Promise<T>
```

<sup><sup>_[source](https://github.com/MathisBullinger/froebel/blob/main/isPromise.ts#L2)_ | _[tests](https://github.com/MathisBullinger/froebel/blob/main/isPromise.test.ts)_</sup></sup>

> Checks if `value` looks like a promise.


#### Import

```ts
/* Node: */  import isPromise from "froebel/isPromise";
/* Deno: */  import isPromise from "https://deno.land/x/froebel@v0.23.1/isPromise.ts";
```




---

#### `isNotPromise` 
  
```hs
(value: T) => value is Exclude<T, Promise<any>>
```

<sup><sup>_[source](https://github.com/MathisBullinger/froebel/blob/main/isPromise.ts#L19)_ | _[tests](https://github.com/MathisBullinger/froebel/blob/main/isPromise.test.ts)_</sup></sup>

> Checks if `value` is not a promise.


#### Import

```ts
/* Node: */  import { isNotPromise } from "froebel/isPromise";
/* Deno: */  import { isNotPromise } from "https://deno.land/x/froebel@v0.23.1/isPromise.ts";
```




#### Example
```ts
(value: number | Promise<unknown>) => {
  if (isNotPromise(value)) return value / 2
}
```
## Predicate

#### `truthy` 
  
```hs
(value: T) => value is PickTruthy<T>
```

<sup><sup>_[source](https://github.com/MathisBullinger/froebel/blob/main/truthy.ts#L2)_ | _[tests](https://github.com/MathisBullinger/froebel/blob/main/truthy.test.ts)_</sup></sup>

> Checks if `value` is truthy. Literal types are narrowed accordingly.


#### Import

```ts
/* Node: */  import { truthy } from "froebel/truthy";
/* Deno: */  import { truthy } from "https://deno.land/x/froebel@v0.23.1/truthy.ts";
```




---

#### `falsy` 
  
```hs
(value: T) => value is PickFalsy<T>
```

<sup><sup>_[source](https://github.com/MathisBullinger/froebel/blob/main/truthy.ts#L5)_ | _[tests](https://github.com/MathisBullinger/froebel/blob/main/truthy.test.ts)_</sup></sup>

> Checks if `value` is falsy. Literal types are narrowed accordingly.


#### Import

```ts
/* Node: */  import { falsy } from "froebel/truthy";
/* Deno: */  import { falsy } from "https://deno.land/x/froebel@v0.23.1/truthy.ts";
```




---

#### `nullish` 
  
```hs
(value: T) => value is Nullish<T>
```

<sup><sup>_[source](https://github.com/MathisBullinger/froebel/blob/main/nullish.ts#L2)_ | _[tests](https://github.com/MathisBullinger/froebel/blob/main/nullish.test.ts)_</sup></sup>

> Checks if `value` is nullish. Literal types are narrowed accordingly.


#### Import

```ts
/* Node: */  import { nullish } from "froebel/nullish";
/* Deno: */  import { nullish } from "https://deno.land/x/froebel@v0.23.1/nullish.ts";
```




---

#### `notNullish` 
  
```hs
(value: null | T) => value is T
```

<sup><sup>_[source](https://github.com/MathisBullinger/froebel/blob/main/nullish.ts#L20)_ | _[tests](https://github.com/MathisBullinger/froebel/blob/main/nullish.test.ts)_</sup></sup>

> Checks if `value` is not nullish. Literal types are narrowed accordingly.


#### Import

```ts
/* Node: */  import { notNullish } from "froebel/nullish";
/* Deno: */  import { notNullish } from "https://deno.land/x/froebel@v0.23.1/nullish.ts";
```




#### Example
```ts
const nums = (...values: (number | undefined)[]): number[] => values.filter(notNullish)
```

---

#### `isFulfilled` 
  
```hs
(result: PromiseSettledResult<T>) => result is PromiseFulfilledResult<T>
```

<sup><sup>_[source](https://github.com/MathisBullinger/froebel/blob/main/settled.ts#L2)_ | _[tests](https://github.com/MathisBullinger/froebel/blob/main/settled.test.ts)_</sup></sup>

> Checks if `result` (returned from `Promise.allSettled`) is fulfilled.


#### Import

```ts
/* Node: */  import { isFulfilled } from "froebel/settled";
/* Deno: */  import { isFulfilled } from "https://deno.land/x/froebel@v0.23.1/settled.ts";
```




---

#### `isRejected` 
  
```hs
(result: PromiseSettledResult<unknown>) => result is PromiseRejectedResult
```

<sup><sup>_[source](https://github.com/MathisBullinger/froebel/blob/main/settled.ts#L7)_ | _[tests](https://github.com/MathisBullinger/froebel/blob/main/settled.test.ts)_</sup></sup>

> Checks if `result` (returned from `Promise.allSettled`) is rejected.


#### Import

```ts
/* Node: */  import { isRejected } from "froebel/settled";
/* Deno: */  import { isRejected } from "https://deno.land/x/froebel@v0.23.1/settled.ts";
```



## String

#### `prefix` 
  
```hs
(prefix: T0, str: T1, caseMod?: C) => `${string}`
```

<sup><sup>_[source](https://github.com/MathisBullinger/froebel/blob/main/prefix.ts#L12)_ | _[tests](https://github.com/MathisBullinger/froebel/blob/main/prefix.test.ts)_</sup></sup>

> Returns `str` prefixed with `prefix`. Optionally, allows prefxing in camel
> case, i.e. `prefix('foo', 'bar', 'camel') => 'fooBar'`, or snake case, i.e.
> `prefix('foo', 'bar', 'snake') => 'foo_bar'`.
> 
> The result is strictly typed, so `prefix('foo', 'bar')` will return the type
> `'foobar'`, not just a generic `string`.
> 


#### Import

```ts
/* Node: */  import prefix from "froebel/prefix";
/* Deno: */  import prefix from "https://deno.land/x/froebel@v0.23.1/prefix.ts";
```




---

#### `suffix` 
  
```hs
(str: T1, suffix: T0, caseMod?: C) => `${string}`
```

<sup><sup>_[source](https://github.com/MathisBullinger/froebel/blob/main/suffix.ts#L8)_ | _[tests](https://github.com/MathisBullinger/froebel/blob/main/suffix.test.ts)_</sup></sup>

> Returns `str` suffixed with `suffix`. Same case and type behavior as
> [prefix](#prefix).


#### Import

```ts
/* Node: */  import suffix from "froebel/suffix";
/* Deno: */  import suffix from "https://deno.land/x/froebel@v0.23.1/suffix.ts";
```




---

#### `surround` 
  
```hs
(str: A, surrounding: B) => B extends "" ? A : Surround<A, B>
```

<sup><sup>_[source](https://github.com/MathisBullinger/froebel/blob/main/surround.ts#L13)_ | _[tests](https://github.com/MathisBullinger/froebel/blob/main/surround.test.ts)_</sup></sup>

> Surrounds the `str` with `surrounding`. `surrounding` must have an even length.


#### Import

```ts
/* Node: */  import { surround } from "froebel/surround";
/* Deno: */  import { surround } from "https://deno.land/x/froebel@v0.23.1/surround.ts";
```




#### Example
```ts
surround("foo", "()")      // "(foo)"
surround("foo", "({[]})")  // "({[foo]})"
```

---

#### `capitalize` 
  
```hs
(str: T) => Capitalize
```

<sup><sup>_[source](https://github.com/MathisBullinger/froebel/blob/main/case.ts#L12)_ | _[tests](https://github.com/MathisBullinger/froebel/blob/main/case.test.ts)_</sup></sup>

> Upper-case first letter of string.


#### Import

```ts
/* Node: */  import { capitalize } from "froebel/case";
/* Deno: */  import { capitalize } from "https://deno.land/x/froebel@v0.23.1/case.ts";
```




---

#### `uncapitalize` 
  
```hs
(str: T) => Uncapitalize
```

<sup><sup>_[source](https://github.com/MathisBullinger/froebel/blob/main/case.ts#L16)_ | _[tests](https://github.com/MathisBullinger/froebel/blob/main/case.test.ts)_</sup></sup>

> Lower-case first letter of string


#### Import

```ts
/* Node: */  import { uncapitalize } from "froebel/case";
/* Deno: */  import { uncapitalize } from "https://deno.land/x/froebel@v0.23.1/case.ts";
```




---

#### `upper` 
  
```hs
(str: T) => Uppercase
```

<sup><sup>_[source](https://github.com/MathisBullinger/froebel/blob/main/case.ts#L20)_ | _[tests](https://github.com/MathisBullinger/froebel/blob/main/case.test.ts)_</sup></sup>

> Strictly typed `String.toUpperCase()`.


#### Import

```ts
/* Node: */  import { upper } from "froebel/case";
/* Deno: */  import { upper } from "https://deno.land/x/froebel@v0.23.1/case.ts";
```




---

#### `lower` 
  
```hs
(str: T) => Lowercase
```

<sup><sup>_[source](https://github.com/MathisBullinger/froebel/blob/main/case.ts#L24)_ | _[tests](https://github.com/MathisBullinger/froebel/blob/main/case.test.ts)_</sup></sup>

> Strictly typed `String.toLowerCase()`.


#### Import

```ts
/* Node: */  import { lower } from "froebel/case";
/* Deno: */  import { lower } from "https://deno.land/x/froebel@v0.23.1/case.ts";
```




---

#### `snake` 
  
```hs
(str: T) => DelimitedCase<T, "_">
```

<sup><sup>_[source](https://github.com/MathisBullinger/froebel/blob/main/case.ts#L40)_ | _[tests](https://github.com/MathisBullinger/froebel/blob/main/case.test.ts)_</sup></sup>

> Transforms a variable name to snake case.
> 
> Note: The rules for transforming anything to snake case are somewhat vague.
> So use this only for very simple names where the resulting value is
> absolutely unambiguous. For more examples of how names are transformed, have
> a look at the test cases.
> 


#### Import

```ts
/* Node: */  import { snake } from "froebel/case";
/* Deno: */  import { snake } from "https://deno.land/x/froebel@v0.23.1/case.ts";
```




#### Example
```ts
snake('fooBar') // 'foo_bar'
```

---

#### `kebab` 
  
```hs
(str: T) => DelimitedCase<T, "-">
```

<sup><sup>_[source](https://github.com/MathisBullinger/froebel/blob/main/case.ts#L64)_ | _[tests](https://github.com/MathisBullinger/froebel/blob/main/case.test.ts)_</sup></sup>

> Transforms a variable name to kebab case.
> 
> Note: The rules for transforming anything to kebab case are somewhat vague.
> So use this only for very simple names where the resulting value is
> absolutely unambiguous. For more examples of how names are transformed, have
> a look at the test cases.
> 


#### Import

```ts
/* Node: */  import { kebab } from "froebel/case";
/* Deno: */  import { kebab } from "https://deno.land/x/froebel@v0.23.1/case.ts";
```




#### Example
```ts
kebab('fooBar') // 'foo-bar'
```

---

#### `camel` 
  
```hs
(str: T) => CamelCase<T>
```

<sup><sup>_[source](https://github.com/MathisBullinger/froebel/blob/main/case.ts#L88)_ | _[tests](https://github.com/MathisBullinger/froebel/blob/main/case.test.ts)_</sup></sup>

> Transforms a variable name to camel case.
> 
> Note: The rules for transforming anything to camel case are somewhat vague.
> So use this only for very simple names where the resulting value is
> absolutely unambiguous. For more examples of how names are transformed, have
> a look at the test cases.
> 


#### Import

```ts
/* Node: */  import { camel } from "froebel/case";
/* Deno: */  import { camel } from "https://deno.land/x/froebel@v0.23.1/case.ts";
```




#### Example
```ts
camel('foo_bar') // 'fooBar'
```

---

#### `pascal` 
  
```hs
(str: T) => Capitalize
```

<sup><sup>_[source](https://github.com/MathisBullinger/froebel/blob/main/case.ts#L109)_ | _[tests](https://github.com/MathisBullinger/froebel/blob/main/case.test.ts)_</sup></sup>

> Transforms a variable name to pascal case.
> 
> Note: The rules for transforming anything to pascal case are somewhat vague.
> So use this only for very simple names where the resulting value is
> absolutely unambiguous. For more examples of how names are transformed, have
> a look at the test cases.
> 


#### Import

```ts
/* Node: */  import { pascal } from "froebel/case";
/* Deno: */  import { pascal } from "https://deno.land/x/froebel@v0.23.1/case.ts";
```




#### Example
```ts
pascal('foo_bar') // 'FooBar'
```

---

#### `screamingSnake` 
  
```hs
(str: T) => Uppercase
```

<sup><sup>_[source](https://github.com/MathisBullinger/froebel/blob/main/case.ts#L122)_ | _[tests](https://github.com/MathisBullinger/froebel/blob/main/case.test.ts)_</sup></sup>

> Transforms a variable name to screaming snake case.
> 
> <sub>see [snake](#snake)</sub>


#### Import

```ts
/* Node: */  import { screamingSnake } from "froebel/case";
/* Deno: */  import { screamingSnake } from "https://deno.land/x/froebel@v0.23.1/case.ts";
```




#### Example
```ts
screamingSnake('fooBar') // 'FOO_BAR'
```

---

#### `transformCase` 
  
```hs
(str: T, targetCase: C) => DelimitedCase<T, "_">
```

<sup><sup>_[source](https://github.com/MathisBullinger/froebel/blob/main/case.ts#L135)_ | _[tests](https://github.com/MathisBullinger/froebel/blob/main/case.test.ts)_</sup></sup>

> Transform a variable name to `targetCase`
> 
> <sub>see [snake](#snake), [kebab](#kebab), [camel](#camel), [pascal](#pascal), and [screamingSnake](#screamingsnake)</sub>


#### Import

```ts
/* Node: */  import { transformCase } from "froebel/case";
/* Deno: */  import { transformCase } from "https://deno.land/x/froebel@v0.23.1/case.ts";
```



## Math

#### `clamp` 
  
```hs
(min: number, num: number, max: number) => number
```

<sup><sup>_[source](https://github.com/MathisBullinger/froebel/blob/main/clamp.ts#L2)_ | _[tests](https://github.com/MathisBullinger/froebel/blob/main/clamp.test.ts)_</sup></sup>

> Clamp `num` between `min` and `max` inclusively.


#### Import

```ts
/* Node: */  import clamp from "froebel/clamp";
/* Deno: */  import clamp from "https://deno.land/x/froebel@v0.23.1/clamp.ts";
```



## Data Structures

#### `BiMap` 
  
```hs
class BiMap<L, R>(data?: Map<L, R> | [L, R][], aliasLeft?: AL, aliasRight?: AR)
```

<sup><sup>_[source](https://github.com/MathisBullinger/froebel/blob/main/bimap.ts#L172)_ | _[tests](https://github.com/MathisBullinger/froebel/blob/main/bimap.test.ts)_</sup></sup>

> Bidirectional map. Maps two sets of keys in a one-to-one relation.
> 
> Both sides are accessible (at .left & .right, or at their respective alias if
> one was provided in the constructor) with an interface similar to that of the
> built-in Map and the same iteration behavior.
> 


#### Import

```ts
/* Node: */  import BiMap from "froebel/bimap";
/* Deno: */  import BiMap from "https://deno.land/x/froebel@v0.23.1/bimap.ts";
```




#### Examples
```ts
const nums = BiMap.from({ one: 1, two: 2 })

// different ways of iterating over the entries
[...nums.left]                 // [['one',1], ['two',2]]
[...nums.right]                // [[1,'one'], [2,'two']]
[...nums.left.keys()]          // ['one', 'two']
[...nums.left.values()]        // [1, 2]
[...nums.right.keys()]         // [1, 2]
[...nums.right.values()]       // ['one', 'two']
[...nums]                      // [['one',1], ['two',2]]
[...nums.right.entries()]      // [[1,'one'], [2,'two']]
Object.fromEntries(nums.right) // { '1': 'one', '2': 'two' }

// setting a value
nums.left.three = 3
// when accessing a property using bracket notation (i.e. nums.right[4]),
// JavaScript coerces the key to a string, so keys that aren't strings or
// symbols must be accessed using the same access methods known from Map.
nums.right.set(4, 'four')

// remapping values
nums.left.tres = 3          // {one: 1, two: 2, tres: 3, four: 4}
nums.right.set(4, 'cuatro') // {one: 1, two: 2, tres: 3, cuatro: 4}

// deleting
delete nums.left.tres    // {one: 1, two: 2, cuatro: 4}
nums.right.delete(4)     // {one: 1, two: 2}

// reversing the map
const num2Name = nums.reverse()
console.log([...num2Name.left])                 // [[1,'one'], [2,'two']]
console.log(Object.fromEntries(num2Name.right)) // {one: 1, two: 2}

// other methods known from built-in Map
nums.size               // 2
nums.[left|right].size  // 2
nums.clear() // equivalent to nums.[left|right].clear()
console.log(nums.size)  // 0
```

```ts
// giving aliases to both sides
const dictionary = new BiMap(
  [
    ['hello', 'hallo'],
    ['bye', 'tschüss'],
  ],
  'en',
  'de'
)

dictionary.de.get('hallo') // 'hello'
dictionary.en.get('bye')   // 'tschüss'

delete dictionary.de.hallo
console.log(Object.fromEntries(dictionary.en)) // { bye: 'tschüss' }

// you can also use the BiMap.alias method:
BiMap.alias('en', 'de')<string, string>()
BiMap.alias('en', 'de')([['hello', 'hallo']])
BiMap.alias('en', 'de')(new Map<string, string>())
BiMap.alias('en', 'de')({ hello: 'hallo' })
BiMap.alias('en', 'de')(new Set(['hello']), new Set(['hallo']))

// the same arguments can be used with BiMap.from, e.g.:
BiMap.from(new Set<number>(), new Set<number>())
```

---

#### `SortedArray` 
  
```hs
class SortedArray<T>(compare: Cmp<T>, ...value: T[])
```

<sup><sup>_[source](https://github.com/MathisBullinger/froebel/blob/main/sortedArray.ts#L134)_ | _[tests](https://github.com/MathisBullinger/froebel/blob/main/sortedArray.test.ts)_</sup></sup>

> Sorted array. Behaves much like a regular array but its elements remain
> sorted using the `compare` function supplied in the constructor.
> 
> Contains most of the methods defined on regular JavaScript arrays as long as
> they don't modify the array's content in place.
> 
> New elements are added using the `add(...values)` method.
> 
> Elements can still be accessed using bracket notation as in plain JavaScript
> arrays but can't be assigned to using bracket notation (as that could change
> the element's sort position).
> 
> Elements can be removed using the `delete(...indices)` method, which returns
> an array containing the deleted values.
> Deleting an element using `delete sorted[index]` will also work, but results
> in a TypeScript error because element access is marked readonly.
> 
> Array methods that pass a reference of the array to a callback (e.g. `map`,
> `reduce`, `find`) will pass a reference to the SortedArray instance instead.
> 
> The `filter` and `slice` methods will return SortedArray instances instead of
> plain arrays.
> 


#### Import

```ts
/* Node: */  import SortedArray from "froebel/sortedArray";
/* Deno: */  import SortedArray from "https://deno.land/x/froebel@v0.23.1/sortedArray.ts";
```




---

#### `SortedMap` 
  
```hs
class SortedMap<K, V>(compare: Cmp<K, V>, entries?: null | [K, V][])
```

<sup><sup>_[source](https://github.com/MathisBullinger/froebel/blob/main/sortedMap.ts#L11)_ | _[tests](https://github.com/MathisBullinger/froebel/blob/main/sortedMap.test.ts)_</sup></sup>

> Behaves like a regular JavaScript `Map`, but its iteration order is dependant
> on the `compare` function supplied in the constructor.
> 
> Note: The item's sort position is only computed automatically on insertion.
> If you update one of the values that the `compare` function depends on, you
> must call the `update(key)` method afterwards to ensure the map stays sorted.
> 


#### Import

```ts
/* Node: */  import SortedMap from "froebel/sortedMap";
/* Deno: */  import SortedMap from "https://deno.land/x/froebel@v0.23.1/sortedMap.ts";
```


