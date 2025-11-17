import {Effect,SchemaAST,Schema} from 'effect'
import {Router} from './router.js'
import {HttpServerRequest} from "./http-server-request.js";
import {Method, AnySchema} from "./types.js";
import {HttpServerResponse, notImplemented} from "./http-server-response.js";
import * as URl from "node:url";

const arrayOfSupportedMethods = ['get', 'post', 'put', 'delete', 'patch']

const isSupportedMethod = (method: string) => arrayOfSupportedMethods.includes(method as Method)

const toPathname = (url: string) => {
    try {
        return new URL(url).pathname
    } catch (_error) {
        return url
    }
}

const decodePayload = <S extends AnySchema>(schema: S) =>
    Effect.gen(function* () {
        const request = yield* HttpServerRequest;
        if (SchemaAST.isNeverKeyword(schema.ast)) {
            return undefined as Schema.Schema.Type<S>;
        }
        /*return yield* request.json.pipe(
            Effect.flatMap(
                Schema.decodeUnknown(
                    schema as Schema.Schema.AnyNoContext,
                ),
            ),
            Effect.mapError(
                (error) =>
                    new InvalidIncomingPayload({
                        message: error.message,
                    }),
            ),*/
        /*);*/
    });


export const makeHttpApp = Effect.gen(function* () {
    const router = yield* Router
    return yield* Effect.gen(function* () {
        const request = yield* HttpServerRequest
        const method =  request.method.toLowerCase()
        if(!isSupportedMethod(method)) {
            return notImplemented()
        }
        const path = request.url
        const pathname = toPathname(path as string)
        const endpoint = yield* router.find(method as Method, pathname)
        if(!endpoint) {
            return notImplemented()
        }
        const handler  = yield* Effect.gen(function* () {
            const payload = yield* request.payload
            const response = yield* endpoint.handler({payload})
            return response
        })
        return yield* handler
    })
})

export type HttpApp = Effect.Effect.Success<
    typeof makeHttpApp
>