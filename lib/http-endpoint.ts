import {
    Effect,
    identity,
    Layer,
    Schema,
    Scope,
} from "effect";
import type {
    AnySchema,
    EndpointHandler,
    Method,
    ProvideHandler,
} from "./types.ts";
import { Router } from "./router.js";

export const makeEndpoint = <
    PayloadSchema extends AnySchema,
    SuccessSchema extends Schema.Schema.AnyNoContext,
    FailureSchema extends AnySchema,
    BuildE,
    BuildR,
>(options: {
    readonly path: string;
    readonly method: Method;
    readonly payload: PayloadSchema;
    readonly success: SuccessSchema;
    readonly failure: FailureSchema;
    readonly build: (
        of: ProvideHandler<
            PayloadSchema,
            SuccessSchema,
            FailureSchema
        >,
    ) => Effect.Effect<
        EndpointHandler<
            PayloadSchema,
            SuccessSchema,
            FailureSchema
        >,
        BuildE,
        BuildR
    >;
}): Layer.Layer<
    never,
    BuildE,
    Router | Exclude<BuildR, Scope.Scope>
> =>
    Layer.scopedDiscard(
        Effect.gen(function* () {
            const router = yield* Router;
            const handler = yield* options.build(identity);

            yield* router.register({
                method: options.method,
                path: options.path,
                payload: options.payload,
                success: options.success,
                failure: options.failure,
                handler,
            });
        }),
    );

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
            yield* Effect.scope;
            yield* Effect.yieldNow();
            return of((request) => Effect.fail(new BadRequest({ code: 400 })));
        }),
})