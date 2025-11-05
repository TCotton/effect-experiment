import {Context, Effect, Layer} from 'effect';
import type {
    AnyRegisteredEndpoint,
    AnySchema, RegisteredEndpoint, Method
} from "./types.js";

const makeRouteKey = (method: Method, path: string) => `${method.toUpperCase()} ${path}`;

// Router object that expose register methods
// and readonly array of the endpoints
export declare namespace Router {
    export type Type = {
        readonly register: <
            PayloadSchema extends AnySchema,
            SuccessSchema extends AnySchema,
            FailureSchema extends AnySchema,
        >(
            endpoint: RegisteredEndpoint<
                PayloadSchema,
                SuccessSchema,
                FailureSchema
            >,
        ) => Effect.Effect<void>
        readonly endpoints: Effect.Effect<
            ReadonlyArray<AnyRegisteredEndpoint>
        >
    }
}

// Router context
//
export class Router extends Context.Tag("@capstone/Router")<
    Router, Router.Type>() {
    static readonly Live = Layer.sync(this, () => {
        const routes = new Map<string, AnyRegisteredEndpoint>()
        return this.of({
            register: (endpoints) => {
                const routeKey = makeRouteKey(endpoints.method, endpoints.path)
                if(routes.has(routeKey)) {
                    return Effect.dieMessage(`Route ${routeKey} already exists`)
                }
                routes.set(routeKey, endpoints)
                // could us generator and yield but for simplicity just return void
                return Effect.void;
            },
            endpoints: Effect.sync(() => Array.from(routes.values()))
        });
    })
}