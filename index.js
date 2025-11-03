'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
var effect_1 = require('effect')

var FormSchema = effect_1.Schema.Struct({
  title: effect_1.Schema.String.pipe(
    effect_1.Schema.transform(effect_1.Schema.String, {
      strict: true,
      decode(value) {
        return value.trim()
      },
      encode: effect_1.identity
    }),
    effect_1.Schema.minLength(3),
    effect_1.Schema.maxLength(100)
  )
})
var decode = effect_1.Schema.decodeSync(FormSchema)
var encode = effect_1.Schema.encodeSync(FormSchema)
var decodedValue = decode({ title: 'Hello' })
console.log(decodedValue)
var encodedValue = encode({ title: 'World' })
console.log(encodedValue)
