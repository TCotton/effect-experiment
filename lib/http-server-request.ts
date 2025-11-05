import { Context } from "effect"

export declare namespace HttpServerRequest {
    export type Type = {
        readonly source: unknown;
        readonly url: unknown;
        readonly method: string;
        readonly headers: Record<
            string,
            string | string[] | undefined
        >
    }
}

export class HttpServerRequest extends Context.Tag(
    "HttpServerRequest",
)<HttpServerRequest, HttpServerRequest.Type>(){}