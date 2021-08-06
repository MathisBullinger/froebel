import debounce from './debounce'

test('debounce', () =>
  new Promise<void>(done => {
    let args: number[] = []

    const fun = (n: number) => {
      args.push(n)
    }

    const debounced = debounce(fun, 50)

    let i = 0
    let iid = setInterval(() => {
      debounced(++i)
      if (i === 3) clearInterval(iid)
    }, 5)

    setTimeout(() => {
      expect(args.length).toBe(1)
      expect(args[0]).toBe(3)
      done()
    }, 100)
  }))

test('cancel debounce', () =>
  new Promise<void>(done => {
    const debounced = debounce(() => {
      throw Error()
    }, 50)

    debounced()
    setTimeout(() => debounced[debounce.cancel](), 25)

    setTimeout(done, 100)
  }))
