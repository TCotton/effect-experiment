import {Schema, Effect} from 'effect'

export type AnySchema =
    | Schema.Schema.AnyNoContext
    | typeof Schema.Never;

export type Method =
    | 'GET'
    | 'POST'
    | 'PUT'
    | 'DELETE'
    | 'PATCH';

export type EndpointHandler<
    PayloadSchema extends AnySchema,
    ResponseSchema extends AnySchema,
    FailureSchema extends AnySchema,
> = (request : {
    readonly payload: Schema.Schema.Type<PayloadSchema>
}) => Effect.Effect<
    never,
    Schema.Schema.Type<FailureSchema>,
    Schema.Schema.Type<ResponseSchema>
>;

export type ProviderHandler<
    PayloadSchema extends AnySchema,
    ResponseSchema extends AnySchema,
    FailureSchema extends AnySchema,
> = <
    Handler extends EndpointHandler<PayloadSchema, ResponseSchema, FailureSchema>
>(
    handler: Handler
) => Handler;

export type RegisteredEndpoint<
    PayloadSchema extends AnySchema,
    SuccessSchema extends AnySchema,
    FailureSchema extends AnySchema,
> = {
    readonly method: Method;
    readonly path: string;
    readonly payload: PayloadSchema;
    readonly success: SuccessSchema;
    readonly failure: FailureSchema;
    readonly handler: ProviderHandler<PayloadSchema, SuccessSchema, FailureSchema>;
};

export type AnyRegisteredEndpoint = RegisteredEndpoint<AnySchema, AnySchema, AnySchema>;