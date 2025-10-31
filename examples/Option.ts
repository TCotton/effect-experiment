import { Cause, Data, Effect, Option } from 'effect'

class CustomErrors extends Data.TaggedError('CustomErrors')<{
  readonly message: string
}> {}

const program = Effect.gen(function*() {
  return yield* new CustomErrors({
    code: 'INTERNAL_SERVER_ERROR',
    message: 'Custom error'
  })
})

const x = Option.fromNullable(null as string | null | undefined).pipe(
  Option.map((value) => value.toUpperCase()),
  Option.map((value) => value.length),
  Option.getOrNull
)

const y = Option.gen(function*() {
  const x = yield* Option.fromNullable(null as string | null | undefined)
  return x
})

const parseJson = Option.liftThrowable(JSON.parse)

const parsedJson = parseJson(JSON.stringify({ name: 'john' }))

const exit = await Effect.runPromiseExit(program)

const interruptOption = Cause.interruptOption(exit.cause)

if (exit._tag === 'Some') {
  throw interruptOption.value
}
