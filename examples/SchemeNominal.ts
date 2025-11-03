import { Data, Effect, ParseResult, Schema } from 'effect'

class Person extends Schema.Class<Person>("Person")({
    name: Schema.String,
    age: Schema.Number
}){}

const data = new Person({ name: "John", age: 28 })
console.log(data)

Schema.decode(Schema.Struct({
    name: Schema.String,
    age: Schema.Number
}), {
    propertyOrder: "on"
})