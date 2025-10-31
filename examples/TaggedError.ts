import { Data, Effect } from 'effect'

class CustomErrors extends Data.TaggedError('CustomErrors')<{
  readonly message: string
}> {}

const program = Effect.fail(
  new CustomErrors({ message: 'Failed to fetch users' })
).pipe(
  Effect.catchTag('CustomErrors', (error) => Effect.succeed('Error handled'))
)

void Effect.runPromiseExit(program).then(console.log)
