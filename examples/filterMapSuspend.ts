import { Array, Effect } from 'effect'

const divide = (a: number, b: number): Effect.Effect<number, Error> =>
  Effect.suspend(() => {
    if (b === 0) {
      return Effect.fail(new Error('Cannot divide by zero'))
    }
    return Effect.succeed(a / b)
  })

const filterNonEmpty = <A>(values: Array<A>): Effect.Effect<Array<A>, Error> =>
  Effect.suspend(() => values.length > 0 ? Effect.succeed(values) : Effect.fail(new Error('Empty array')))

const program = Effect.sync(() => ({
  id: 'report-123',
  timestamp: new Date().toISOString(),
  values: [10, 20, 30, 40, 50]
})).pipe(
  Effect.map((successValues) => successValues.values),
  Effect.filterOrFail(Array.isNonEmptyArray, () => new Error('Array is empty')),
  Effect.flatMap(filterNonEmpty),
  Effect.flatMap((values) => {
    const sum = values.reduce((a, b) => a + b, 0)
    return divide(sum, values.length)
  }),
  Effect.catchAll((error) => Effect.logError(error))
)

void Effect.runPromiseExit(program).then(console.log)
