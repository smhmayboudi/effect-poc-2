import {Cause, Context, Effect, Layer, Option} from 'effect';
import {Todo, TodoId, TodoCreateParams, TodoUpdateParams} from './todo-model';
import {TodoRepository} from './todo-repository';

const makeTodoService = Effect.gen(function* () {
  const repository = yield* TodoRepository;

  const createTodo = (
    params: TodoCreateParams
  ): Effect.Effect<number, never, never> => repository.createTodo(params);

  const deleteTodo = (id: TodoId): Effect.Effect<boolean, never, never> =>
    repository.deleteTodo(id);

  const getTodo = (
    id: TodoId
  ): Effect.Effect<Option.Option<Todo>, never, never> => repository.getTodo(id);

  const getTodos = (): Effect.Effect<ReadonlyArray<Todo>, never, never> =>
    repository.getTodos();

  const updateTodo = (
    id: TodoId,
    params: TodoUpdateParams
  ): Effect.Effect<Todo, Cause.NoSuchElementException, never> =>
    repository.updateTodo(id, params);

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
  static readonly live = Layer.effect(TodoService, makeTodoService);
}
