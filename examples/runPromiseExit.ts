import { Effect } from 'effect'

type Thunk<A, E, R> = Effect.Effect<A, E, R>

const program = Effect.succeed('Hello world')
const program2 = Effect.fail(new Error('Something went wrong'))
const random = Effect.sync(() => Math.random())

const main = Effect.all([program, random])

const fetchUser = Effect.tryPromise({
  try: () => fetch('https://jsonplaceholder.typicode.com/users/1'),
  catch: (error) => Effect.fail(error)
})

try {
  const result = await Effect.runPromiseExit(fetchUser)
  if (result._tag === 'Success') {
    console.log(result.value)
    const data = await result.value.json()
    console.log(data)
  }
} catch (error) {
  console.log({ error })
}
console.log('happy hunting')
