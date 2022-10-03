class ReactiveEffect {
  private _fn: any

  constructor(fn, public scheduler?) {
    this._fn = fn
  }
  run() {
    activeEffect = this
    return this._fn()
  }
}

const targetMap = new Map()
export const track = (target, key) => {
  let depsMap = targetMap.get(target)
  if (!depsMap) {
    depsMap = new Map()
    targetMap.set(target, depsMap)
  }
  let dep = depsMap.get(key)
  if (!dep) {
    dep = new Set()
    depsMap.set(key, dep)
  }
  dep.add(activeEffect)
}
export const trigger = (target, key) => {
  let depsMap = targetMap.get(target)
  let dep = depsMap.get(key)

  for (const effect of dep) {
    if (effect.scheduler) {
      effect.scheduler()
    } else {
      effect.run()
    }
  }
}
// 用一个全局变量存储被注册的副作用函数
let activeEffect
export const effect = (fn, options: any = {}) => {
  const { scheduler } = options
  // 这里存起来跑一下触发reactive的get
  const _effect = new ReactiveEffect(fn, scheduler)
  _effect.run()
  return _effect.run.bind(_effect)
}