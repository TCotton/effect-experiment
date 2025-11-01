import { Cause, Data, Effect, Option, Schedule } from 'effect'

class RequestError extends Data.TaggedError('RequestError')<{
  cause: unknown
}> {}

class ResponseError extends Data.TaggedError('ResponseError')<{
  status: number
}> {}

const effectfulFetch = (url: string) =>
  Effect.tryPromise({
    try: () => fetch(url),
    catch: (error) => new RequestError({ cause: error })
  }).pipe(
    Effect.filterOrFail(
      (response) => response.ok,
      (response) => new ResponseError({ status: response.status })
    )
  )

const effectfulProgram2 = (url: string) =>
  Effect.gen(function*() {
    const response = yield* Effect.tryPromise({
      try: () => fetch(url),
      catch: (error) => new RequestError({ cause: error })
    })

    if (!response.ok) {
      return yield* new ResponseError({ status: response.status })
    }

    return response.json()
  })

const effectfulProgram3 = Effect.fn(function*(url: string) {
  const response = yield* Effect.tryPromise({
    try: () => fetch(url),
    catch: (error) => new RequestError({ cause: error })
  })

  if (!response.ok) {
    return yield* new ResponseError({ status: response.status })
  }

  return response
})

const program = Effect.gen(function*() {
  const response = yield* effectfulProgram3('https://jsonplaceholder.typicode.com/todos/1')
  const json: unknown = yield* Effect.tryPromise({
    try: () => response.json(),
    catch: (error) => new RequestError({ cause: error })
  })
  return json
}).pipe(
  Effect.timeoutOption(5000),
  Effect.retry({
    times: 3,
    while: (error) => error._tag === 'RequestError' || error.status === 500,
    schedule: Schedule.exponential(500)
  }),
  Effect.orDie
)
