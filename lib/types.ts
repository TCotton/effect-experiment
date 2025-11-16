import { Schema, Effect, Scope } from "effect";

export type AnySchema =
    | Schema.Schema.AnyNoContext
    | typeof Schema.Never;

export type Method =
    | "GET"
    | "POST"
    | "PUT"
    | "DELETE"
    | "PATCH";

export type EndpointHandler<
    PayloadSchema extends AnySchema,
    SuccessSchema extends Schema.Schema.AnyNoContext,
    FailureSchema extends AnySchema,
> = (request: {
    readonly payload: Schema.Schema.Type<PayloadSchema>;
}) => Effect.Effect<
    Schema.Schema.Type<SuccessSchema>,
    Schema.Schema.Type<FailureSchema>,
    Scope.Scope
>;

export type ProvideHandler<
    PayloadSchema extends AnySchema,
    SuccessSchema extends Schema.Schema.AnyNoContext,
    FailureSchema extends AnySchema,
> = <
    Handler extends EndpointHandler<
        PayloadSchema,
        SuccessSchema,
        FailureSchema
    >,
>(
    handler: Handler,
) => Handler;

export type RegisteredEndpoint<
    PayloadSchema extends AnySchema,
    SuccessSchema extends Schema.Schema.AnyNoContext,
    FailureSchema extends AnySchema,
> = {
    readonly method: Method;
    readonly path: string;
    readonly payload: PayloadSchema;
    readonly success: SuccessSchema;
    readonly failure: FailureSchema;
    readonly handler: EndpointHandler<
        PayloadSchema,
        SuccessSchema,
        FailureSchema
    >;
};

export type AnyRegisteredEndpoint = RegisteredEndpoint<
    AnySchema,
    Schema.Schema.AnyNoContext,
    AnySchema
>;