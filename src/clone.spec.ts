import clone from './clone'

test('clone', () => {
  expect(clone(1)).toBe(1)
  expect(clone(null)).toBe(null)
  expect(clone('foo')).toBe('foo')

  {
    const v = [1, 'a', { foo: ['bar', { baz: [[2, 3]] }, 'a'] }]
    expect(clone(v)).toEqual(v)
    expect(clone(v)).not.toBe(v)
  }

  {
    const v: any = {}
    v.p = v

    const cloned = clone(v)
    expect(cloned).toEqual(v)
    expect(cloned).not.toBe(v)

    expect(cloned.p).toBe(cloned)
    expect(cloned.p).not.toBe(v)
  }

  {
    const v: any = { foo: {} }
    v.foo.bar = v

    const cloned = clone(v)
    expect(cloned).toEqual(v)
    expect(cloned).not.toBe(v)

    expect(cloned.foo.bar).toBe(cloned)
    expect(cloned.foo.bar).not.toBe(v)
  }
})
