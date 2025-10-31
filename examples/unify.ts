import { Effect, Unify } from 'effect'

const divide = Unify.unify((a: number, b: number) => {
  if (b === 0) {
    return Effect.fail(new Error('Cannot divide by zero'))
  }
  return Effect.succeed(a / b)
})

const result = await Effect.runPromise(divide(10, 2))
console.log(result)
