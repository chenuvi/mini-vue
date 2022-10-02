import { effect } from '../effect'
import { reactive } from '../reactive'

describe("effect", () => {
  it("effect happy path", () => {
    const user = reactive({
      name: 'sys',
      age: 18
    })

    let nextAge
    effect(() => {
      nextAge = user.age + 1
    })
    expect(nextAge).toBe(19)

    // update
    user.age++
    expect(nextAge).toBe(20)
  })

  it("should return runner when call effect", () => {
    // 1. effect(fn) => function (runner) => fn => return
    let foo = 10
    const runner = effect(() => {
      foo++
      return "foo"
    })
    expect(foo).toBe(11)
    const res = runner()
    expect(foo).toBe(12)
    expect(res).toBe("foo")
  })
})