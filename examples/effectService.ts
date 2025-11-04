import {Context, Effect, Schema, Console, Layer} from 'effect'

class Database extends Effect.Service<Database>()("Database", {
    effect: Effect.gen(function* () {
        yield* Console.log("Database.Default created");

        return {
            execute: (query: string) => Effect.sync(() => console.log(`Executing: ${query}`)),
        };
    }),
}) {}

const AppLive = Database.Default;

const DatabaseTest = Layer.succeed(
    Database,
    Database.make({
        execute: (query) => Effect.sync(() => console.log(`[TEST] ${query}`)),
    }),
);

const UserId = Schema.String.pipe(Schema.brand("UserId"))

type UserId = typeof UserId.Type

class User extends Schema.Class<User>("User")({
    id: UserId,
    age: Schema.Number
}) {}

class TodoRepository extends Effect.Service<TodoRepository>()("TodoRepository", {
    dependencies: [Database.Default],
    effect: Effect.gen(function* () {
        const database = yield* Database;

        return {
            getTodo: (id: string) => database.execute(`SELECT * FROM todos WHERE id = ${id}`),
        };
    }),
}) {}

class UserRepository extends Effect.Service<UserRepository>()("UserRepository", {
    dependencies: [Database.Default],
    effect: Effect.gen(function* () {
        const database = yield* Database

        return {
            getUser: (id: string) =>
                database.execute(`SELECT * FROM users WHERE id = ${id}`)
        }
    }),
}) {}
const program = Effect.gen(function* () {
    const userRepository = yield* UserRepository
    const user = yield* userRepository.getUser(
        UserId.make('1')
    )
    return user
}).pipe(Effect.provideService(UserRepository, {
    getUser(id) {
        return Effect.succeed(new User({id, age: 28}))
    }
}))

const AppLive = Layer.mergeAll(UserRepository.Default, TodoRepository.Default);

// Using effect
// For services that need to perform effects during construction:

class Logger extends Effect.Service<Logger>()("Logger", {
    effect: Effect.gen(function* () {
        const config = yield* Config;
        return { log: (msg: string) => Console.log(msg) };
    }),
}) {}

//Using sync
// For services that can be constructed synchronously:

class Counter extends Effect.Service<Counter>()("Counter", {
    sync: () => ({ count: 0 }),
}) {}

// Using succeed
// For services with a static value:

class Config extends Effect.Service<Config>()("Config", {
    succeed: { apiUrl: "https://api.example.com" },
}) {}

//Using scoped
// For services with lifecycle management (we'll cover this in a moment):

class Connection extends Effect.Service<Connection>()("Connection", {
    scoped: Effect.gen(function* () {
        const conn = yield* acquireConnection;
        yield* Effect.addFinalizer(() => closeConnection(conn));
        return conn;
    }),
}) {}

Effect.runPromise(program)



