export type HTTPServerResponse = {
    readonly status: number;
    readonly headers?: Record<string, string | string[] | undefined>
    readonly body: string | Uint8Array
}

export const json = (
    status: number,
    body: string
): HTTPServerResponse => ({
    status,
    headers: {
        'Content-Type': 'application/json'
    },
    body
})

export const empty = (
    status: number = 204
): HTTPServerResponse => ({
    status,
    body: ""
})

export const internalError = () => HTTPServerResponse => ({
    status: 500,
    body: "Internal Server Error"
})

export const notImplemented = () => HTTPServerResponse => ({status: 501, body: "Not Implemented"})

export const badRequest = () => HTTPServerResponse => ({status: 400, body: "Bad Request"})