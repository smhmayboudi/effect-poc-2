import {Cause, Context, Effect, Layer, Option} from 'effect';
import {Todo, TodoId, TodoCreateParams, TodoUpdateParams} from './todo-model';
import {TodoRepository} from './todo-repository';

const makeTodoService = Effect.gen(function* () {
  const repository = yield* TodoRepository;
  // const aTodo = new Todo({id: TodoId(1), title: 'title', completed: true});

  const createTodo = (
    params: TodoCreateParams
  ): Effect.Effect<number, never, never> => repository.createTodo(params);
  // const createTodo = (
  //   params: TodoCreateParams
  // ): Effect.Effect<number, never, never> => Effect.succeed(1);

  const deleteTodo = (id: TodoId): Effect.Effect<boolean, never, never> =>
    repository.deleteTodo(id);
  // const deleteTodo = (id: TodoId): Effect.Effect<boolean, never, never> =>
  //   Effect.succeed(true);

  const getTodo = (
    id: TodoId
  ): Effect.Effect<Option.Option<Todo>, never, never> => repository.getTodo(id);
  // const getTodo = (
  //   id: TodoId
  // ): Effect.Effect<Option.Option<Todo>, never, never> =>
  //   Effect.succeed(Option.some(aTodo));

  const getTodos = (): Effect.Effect<ReadonlyArray<Todo>, never, never> =>
    repository.getTodos();
  // const getTodos = (): Effect.Effect<ReadonlyArray<Todo>, never, never> =>
  //   Effect.succeed([aTodo]);

  const updateTodo = (
    id: TodoId,
    params: TodoUpdateParams
  ): Effect.Effect<Todo, Cause.NoSuchElementException, never> =>
    repository.updateTodo(id, params);
  // const updateTodo = (
  //   id: TodoId,
  //   params: TodoUpdateParams
  // ): Effect.Effect<Todo, Cause.NoSuchElementException, never> =>
  //   Effect.succeed(aTodo);

  return {
    createTodo,
    deleteTodo,
    getTodo,
    getTodos,
    updateTodo,
  } as const;
});

export class TodoService extends Context.Tag('TodoService')<
  TodoService,
  Effect.Effect.Success<typeof makeTodoService>
>() {
  static readonly Live = Layer.effect(TodoService, makeTodoService);
}
