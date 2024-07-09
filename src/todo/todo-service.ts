import {Context, Effect, Layer, Option} from 'effect';
import {TodoRepository} from './todo-repository';
import {TodoUpdateError} from './todo-error';
import {TodoCreateParamsBO, TodoUpdateParamsBO} from './todo-model-bo';
import {Todo} from './todo-model-dao';
import {TodoId} from './todo-model-index';

const makeTodoService = Effect.gen(function* () {
  const repository = yield* TodoRepository;

  const createTodo = (
    params: TodoCreateParamsBO
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
    params: TodoUpdateParamsBO
  ): Effect.Effect<Todo, TodoUpdateError, never> =>
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
