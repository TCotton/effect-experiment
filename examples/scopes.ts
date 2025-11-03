import { Data, Effect, ParseResult, Schema } from 'effect'
import {delayed} from "effect/Schedule";

const program = Effect.gen(function*() {
    yield* Effect.dieMessage('boom')
}).pipe(
    Effect.onExit( (_exit) => Effect.log('done')),
    Effect.runPromise
)