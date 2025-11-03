import { Effect } from 'effect'

declare const openReport: Effect.Effect<{
    readonly path: string;
    readonly close: () => Promise<void>
}>

const program = Effect.gen(function*() {
    yield* Effect.acquireUseRelease(
        openReport,
        (handle) => Effect.log(`${handle.path}`),
        (handle) => Effect.promise(() => handle.close())
    )
})

// Run the program
Effect.runPromise(program).then(() => console.log('Program completed'))