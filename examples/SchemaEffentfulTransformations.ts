import { Data, Effect, ParseResult, Schema } from 'effect'

const ProductId = Schema.Trimmed.pipe(Schema.minLength(1))
const Product = Schema.Struct({
    id: ProductId,
    name: Schema.String,
    price: Schema.Number
})

class ProductNotFoundError extends Data.TaggedError('ProductNotFoundError')<{}> {}

const ProductRepository = {
    findById: (id: string) =>
        Effect.suspend(() =>
            id === 'SKU-123'
                ? Effect.succeed({ id, name: 'Widget', price: 499 })
                : Effect.fail(new ProductNotFoundError())
        )
}

const ProductFromId = Schema.transformOrFail(
    ProductId,
    Product,
    {
        strict: true,
        encode: (product) => Effect.succeed(product.id),
        decode(id, _options, ast, _rawId) {
            return ProductRepository.findById(id).pipe(
                Effect.mapError(() => new ParseResult.Transformation(
                    ast,
                    _rawId,
                    'Encoded',
                    new ParseResult.Type(ast.to, _rawId, 'Product Not Found')
                ))
            )
        }
    }
)

const decode = Schema.decodeUnknown(ProductFromId)
decode('SKU-2').pipe(Effect.tap(console.log), Effect.runPromise)
