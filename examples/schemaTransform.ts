import { Effect, Schema } from 'effect'

const StringOrNumberFromString = Schema.transform(
  Schema.String,
  Schema.Number,
  {
    strict: false,
    decode: (string) => Number(string),
    encode: (number) => String(number)
  }
).pipe(Schema.asSchema)

type Decoded = typeof StringOrNumberFromString.Type
type Encoded = typeof StringOrNumberFromString.Encoded

const decode = Schema.decodeSync(StringOrNumberFromString)
const encode = Schema.encodeSync(StringOrNumberFromString)

const decoded: Decoded = decode('123')
const encoded: Encoded = encode(123)
console.log(decoded)
console.log(encoded)

///
/// Accepts 'yes' | 'no' | 0 | 1
/// Decoded is a boolean
