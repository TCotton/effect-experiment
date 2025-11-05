import {Effect, Layer, identity, Scope, Schema } from "effect";
import type {AnySchema, EndpointHandler, Method, ProviderHandler} from "./types.js";
import {Router} from "./router.js";

type HttpEndpointLayer<
    _PayloadSchema extends AnySchema,
    _SuccessSchema extends AnySchema,
    _FailureSchema extends AnySchema,
    BuildE,
    BuildR
> = Layer.Layer<never, BuildE, Router | BuildR>

export const makeEndpoint = <
    PayloadSchema extends AnySchema,
    SuccessSchema extends AnySchema,
    FailureSchema extends AnySchema,
    BuildE,
    BuildR
>(options: {
    readonly path: string;
    readonly method: Method;
    readonly payload: PayloadSchema;
    readonly success: SuccessSchema;
    readonly failure: FailureSchema;
    readonly build: (of: ProviderHandler<PayloadSchema, SuccessSchema, FailureSchema>) => Effect.Effect<
        EndpointHandler<
            PayloadSchema,
            SuccessSchema,
            FailureSchema
        >,
        BuildE,
        Router | Exclude<BuildR, Scope.Scope>
    >;
}):HttpEndpointLayer<any, any, any, any, any> => Layer.effectDiscard(Effect.gen(function* () {
    const router = yield* Router;

    yield* router.register({
            method: options.method,
            path: options.path,
            payload: options.payload,
            success: options.success,
            failure: options.failure,
            handler: identity,
        }
    )
}))

class BadRequest extends Schema.TaggedError<BadRequest>(
    'BadRequest',
)('BadRequest', {
    code: Schema.NumberFromString
}) {}

const TestEndpoint = makeEndpoint({
    failure: BadRequest,
    payload: Schema.String,
    success: Schema.Struct({}),
    method: "GET",
    path: "/test",
    build: (of) =>
        Effect.gen(function* () {
        yield* Effect.yieldNow();
        return of((request) => Effect.fail(new BadRequest({ code: 400 })));
    }),
})