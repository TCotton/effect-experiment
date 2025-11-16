import type { Effect } from 'effect'
import type { HTTPServerResponse } from './http-server-response.js'
import type { HttpServerRequest } from './http-server-request.js'
import { Router } from './router.js'

export type HttpApp<E = never, R = never> = Effect.Effect<
    HTTPServerResponse,
    E,
    R | HttpServerRequest
>

export const makeHttpApp = Effect.gen(function* () {
    const router = yield* Router
    return Effect.gen(function* () {

    })
})

export type HttpApp = Effect.Effect.Success<
    typeof makeHttpApp
>