import { Schema } from 'effect'

const ToDo = Schema.Struct({
  title: Schema.String,
  completed: Schema.String,
  created_at: Schema.DateFromString
}).pipe( // alternative Schema.rename
  (self) => {
    const test = Schema.typeSchema(self).pipe(
      Schema.asSchema
    )
    return test
  },
  (self) =>
    Schema.transform(
      self,
      Schema.typeSchema(
        Schema.Struct({
          title: self.fields.title,
          completed: self.fields.completed,
          createAt: self.fields.created_at
        })
      ),
      {
        strict: true,
        decode: (fromA) => ({
          ...fromA,
          createAt: fromA.created_at
        }),
        encode: (toA) => ({
          ...toA,
          created_at: toA.createAt
        })
      }
    )
)

console.log('ToDo schema created successfully')
console.log(ToDo)
