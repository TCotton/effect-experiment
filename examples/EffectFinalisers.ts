import { Scope, Effect, Exit, Console } from 'effect'

const program = Effect.gen(function* () {
    const scope = yield* Scope.make();
    yield* Scope.addFinalizer(scope, Console.log('closing network connection'))
    yield* Scope.addFinalizer(scope, Console.log('finalise one'))
    yield* Console.log('work done')
    yield* Scope.close(scope, Exit.succeed(null))
})

