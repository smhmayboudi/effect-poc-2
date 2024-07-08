import {
  Array,
  Cause,
  Context,
  Effect,
  HashMap,
  Layer,
  Option,
  Ref,
  pipe,
} from 'effect';
import {Todo, TodoId, TodoCreateParams, TodoUpdateParams} from './todo-model';

const makeTodoRepository = Effect.gen(function* () {
  const nextIdRef = yield* Ref.make(0);
  const todosRef = yield* Ref.make(HashMap.empty<number, Todo>());

  const createTodo = (
    params: TodoCreateParams
  ): Effect.Effect<number, never, never> =>
    pipe(
      Ref.getAndUpdate(nextIdRef, n => n + 1),
      Effect.flatMap(id =>
        Ref.modify(todosRef, map => {
          const newTodo = new Todo({...params, id: TodoId(id)});
          const updated = HashMap.set(map, newTodo.id, newTodo);
          return [newTodo.id, updated];
        })
      )
    );

  const deleteTodo = (id: TodoId): Effect.Effect<boolean, never, never> =>
    pipe(
      Ref.get(todosRef),
      Effect.flatMap(map =>
        HashMap.has(map, id)
          ? pipe(Ref.set(todosRef, HashMap.remove(map, id)), Effect.as(true))
          : Effect.succeed(false)
      )
    );

  const getTodo = (
    id: TodoId
  ): Effect.Effect<Option.Option<Todo>, never, never> =>
    pipe(Ref.get(todosRef), Effect.map(HashMap.get(id)));

  const getTodos = (): Effect.Effect<ReadonlyArray<Todo>, never, never> =>
    pipe(
      Ref.get(todosRef),
      Effect.map(map => Array.fromIterable(HashMap.values(map)))
    );

  const updateTodo = (
    id: TodoId,
    params: TodoUpdateParams
  ): Effect.Effect<Todo, Cause.NoSuchElementException, never> =>
    pipe(
      Ref.get(todosRef),
      Effect.flatMap(map => {
        const maybeTodo = HashMap.get(map, id);
        if (Option.isNone(maybeTodo)) {
          return Effect.fail(new Cause.NoSuchElementException());
        }
        const newTodo = new Todo({...maybeTodo.value, ...params});
        const updated = HashMap.set(map, id, newTodo);
        return pipe(Ref.set(todosRef, updated), Effect.as(newTodo));
      })
    );

  return {
    createTodo,
    deleteTodo,
    getTodo,
    getTodos,
    updateTodo,
  } as const;
});

export class TodoRepository extends Context.Tag('TodoRepository')<
  TodoRepository,
  Effect.Effect.Success<typeof makeTodoRepository>
>() {
  static readonly live = Layer.effect(TodoRepository, makeTodoRepository);
}
