import { Effect } from 'effect'

const program = Effect.succeed(42)

// Run the effect and log the result
Effect.runPromise(program).then((v) => console.log('program result:', v))
import { Data, Effect, ParseResult, Schema } from 'effect'

class Person extends Schema.Class<Person>("Person")({
    name: Schema.String,
    age: Schema.Number
}){}

const data = new Person({ name: "John", age: 28 })
console.log(data)

const consumePerson = (person: Person)=> {

}