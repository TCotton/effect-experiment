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
} from "./types.js";
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
    never, // why never? because we don't need to keep anything from the build effect'
    BuildE,
    Router | Exclude<BuildR, Scope.Scope> //
    /*
    Router - This indicates that the Effect requires a Router service to be provided in the environment.

    Exclude<BuildR, Scope.Scope> - This is a TypeScript utility type that:

    Takes the generic BuildR type (which represents the requirements that the build function might need)
    Excludes any Scope.Scope requirements from it
    Returns everything in BuildR except Scope.Scope
    Router | Exclude<BuildR, Scope.Scope> - The union combines both:

    The Router requirement (always needed)
    Any other requirements from BuildR except Scope.Scope
    Why exclude Scope.Scope?
    The exclusion of Scope.Scope is crucial because:

    The makeEndpoint function uses Layer.effectDiscard which automatically provides scope management
    When you use Layer.effectDiscard or similar Layer constructors, they handle the Scope internally
    If Scope.Scope wasn't excluded, it would create a type mismatch where the Effect expects a Scope to be provided externally, but the Layer is already managing it internally
    This is a sophisticated way of saying: "This Effect needs a Router, plus whatever else the build function needs, but don't worry about Scope management - we'll handle that for you."
     */
> =>
    Layer.scopedDiscard( // why scopedDiscard? because we don't need to keep anything from the build effect
        Effect.gen(function* () {
            const router = yield* Router;
            const handler = yield* options.build(identity); // what does identity do here? it just returns the handler as is

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