import { Context, Effect } from "effect"

export declare namespace HttpServerRequest {
    export type Type = {
        readonly payload: Generator<unknown, void, unknown>;
        readonly source: unknown;
        readonly url: unknown;
        readonly method: string;
        readonly headers: Record<
            string,
            string | string[] | undefined
        >;
        readonly text: Effect.Effect<string>
    }
}

export class HttpServerRequest extends Context.Tag(
    "HttpServerRequest",
)<HttpServerRequest, HttpServerRequest.Type>(){}