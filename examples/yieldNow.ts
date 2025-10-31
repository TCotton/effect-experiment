import { Effect } from 'effect'

const hello = Effect.gen(function*() {
  yield* Effect.log('before sleep')
  yield* Effect.fork(Effect.log('after sleep'))
  // tells the runtime I'm read
  yield* Effect.yieldNow()
  return 'Hello'
})

await Effect.runPromiseExit(hello)
