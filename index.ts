import { Effect, Array } from "effect"

const makeTask = (index: number) =>
    Effect.gen(function*() {
        yield* Effect.sleep("200 millis")
        yield* Effect.log(`Task ${index} finished`)
    })

const program = Effect.gen(function*() {
    const tasks = Array.makeBy(10, (i) => makeTask(i))
    yield* Effect.all(tasks, { concurrency: 2 })
})


Effect.runPromise(program)


