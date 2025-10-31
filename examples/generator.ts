import { Array, Effect } from 'effect'

const divide = (a: number, b: number): Effect.Effect<number, Error> =>
  Effect.suspend(() => {
    if (b === 0) {
      return Effect.fail(new Error('Cannot divide by zero'))
    }
    return Effect.succeed(a / b)
  })

const getReport = Effect.sync(() => ({
  id: 'report-123',
  timestamp: new Date().toISOString(),
  values: [10, 20, 30, 40, 50]
}))

const program = Effect.gen(function*() {
  const value = null as null | number
  if (value === null) return yield* Effect.fail(new Error('Value is null'))
  return value
})

const gen = Effect.gen(function*() {
  const report = yield* getReport
  if (Array.isEmptyArray(report.values)) return yield* Effect.fail(new Error('Empty array'))
  const sum = report.values.reduce((a, b) => a + b, 0)
  const result = yield* divide(sum, report.values.length)
  return result
}).pipe(Effect.orElseSucceed(() => 0))

void Effect.runPromiseExit(gen).then(console.log)
