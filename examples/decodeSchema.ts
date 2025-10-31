import {Effect, Schema} from 'effect'

const User = Schema.Struct({
    name: Schema.String,
    age: Schema.Number
})

const decode = Schema.decodeUnknown(User)

const y = decode({name: 'john', age: 28})

const x = await Effect.runPromise(y.pipe(
    Effect.catchTag('ParseError', error => Effect.fail(error.message))
))

console.log(x)