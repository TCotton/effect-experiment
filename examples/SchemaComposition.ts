import { identity, Schema, Struct } from 'effect'

const NonNan = Schema.asSchema(Schema.NonNaN)

const NonNanFromAString = Schema.NumberFromString.pipe(
  Schema.compose(Schema.NonNaN),
  Schema.asSchema
)

const InsertModel = Schema.Struct({
  name: Schema.optionalWith(Schema.String, {}),
  age: Schema.optionalWith(Schema.Number, {})
})

type InsertModel = typeof InsertModel.Type

const OutPutModel = Schema.Struct(
  Struct.evolve(InsertModel.fields, {
    name: () => Schema.String
  })
)

const OutPutModel2 = InsertModel.pipe(
  Schema.compose(
    Schema.Struct({
      name: Schema.String
    })
  ),
  Schema.asSchema
)

const x = Schema.parseJson().pipe(Schema.asSchema)
