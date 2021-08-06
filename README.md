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

<sup><sup>_[source](https://github.com/MathisBullinger/snatchblock/blob/main/src/partial.ts#L1)_</sup></sup>



### `forward` 
  
```hs
(fun: T, ...argsR: PR) => (...argsL: PL) => ReturnType<T>
```

<sup><sup>_[source](https://github.com/MathisBullinger/snatchblock/blob/main/src/forward.ts#L1)_</sup></sup>

