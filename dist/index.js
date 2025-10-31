import { Effect } from 'effect';
const program = Effect.succeed('Hello world');
const program2 = Effect.fail(new Error('Something went wrong'));
const random = Effect.sync(() => Math.random());
const main = Effect.all([program, program2, random]);
const fetchUser = Effect.tryPromise({
    try: () => fetch('https://jsonplaceholder.typicode.com/users/1'),
    catch: (error) => new Error('Something went wrong')
});
const result = Effect.runSync(main);
console.log(result);
console.log('happy hunting');
//# sourceMappingURL=index.js.map