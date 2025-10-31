import { Data, Effect } from 'effect'

class CustomErrors extends Data.TaggedError('CustomErrors')<{
  readonly message: string
}> {}

class RequestError extends Error {
  _tag = 'RequestError' as const
  constructor(readonly message: string) {
    super(message)
  }
}

const promise = Effect.promise(() => Promise.reject(new CustomErrors({ message: 'Failed to fetch users' }))).pipe(
  Effect.sandbox
)

void Effect.runPromiseExit(promise).then((exit) => {
  console.log(exit, { depth: null })
})
