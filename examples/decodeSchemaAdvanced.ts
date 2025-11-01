import { Effect, Schema } from 'effect'

const User = Schema.Struct({
  name: Schema.optionalWith(Schema.String, {
    as: 'Option',
    nullable: true
  }),
  age: Schema.Number
})

type DecodedUser = typeof User.Type
type EncodedUser = typeof User.Encoded

const decode = Schema.decode(User)
const encode = Schema.encode(User)

const DecodedUser = decode({
  name: 'John',
  age: 28
})

console.log(DecodedUser)

const decodedValue = Effect.runSync(DecodedUser)
const EncodedUser = encode(decodedValue)

console.log(EncodedUser)
