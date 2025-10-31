import { Data, Effect, Fiber } from 'effect'

class CustomErrors extends Data.TaggedError('CustomErrors')<{
  readonly message: string
}> {}

const slow = Effect.gen(function*() {
  yield* Effect.sleep(1000)
  yield* new CustomErrors()
  yield* Effect.log('slow')
  return 50
})

const hello = Effect.gen(function*() {
  yield* Effect.log('Before fork')
  const fiber = yield* Effect.fork(slow)
  const exit = yield* fiber.await
  yield* Effect.log('after fork')
})

Effect.runPromiseExit(hello)
