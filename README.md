# A strictly typed TypeScript utility library.

## Function

### `ident` 
  
```hs
(value: T) => T
```

<sup><sup>_[source](https://github.com/MathisBullinger/snatchblock/blob/main/src/ident.ts#L2)_</sup></sup>

Identity function.

### `partial` 
  
```hs
(fun: T, ...argsL: PL) => (...argsR: PR) => ReturnType<T>
```

<sup><sup>_[source](https://github.com/MathisBullinger/snatchblock/blob/main/src/partial.ts#L15)_</sup></sup>

Partially apply a function.

#### Example
```ts
const divide = (dividend: number, divisor: number) => dividend / divisor

// (divisor: number) => number
const oneOver = partial(divide, 1)

// prints: 0.25
console.log(oneOver(4))
```

### `forward` 
  
```hs
(fun: T, ...argsR: PR) => (...argsL: PL) => ReturnType<T>
```

<sup><sup>_[source](https://github.com/MathisBullinger/snatchblock/blob/main/src/forward.ts#L26)_</sup></sup>

Given a functions and its nth..last arguments, return a function accepting
arguments 0..n-1.

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
## Promise

### `isPromise` 
  
```hs
(value: unknown) => value is Promise<T>
```

<sup><sup>_[source](https://github.com/MathisBullinger/snatchblock/blob/main/src/isPromise.ts#L2)_</sup></sup>

Checks if its first argument look like a promise.