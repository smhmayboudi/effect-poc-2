import {Context, Effect, Layer} from 'effect';
import {TodoRepository} from './todo-repository';
import {TodoUpdateError} from './todo-error';
import {
  TodoModelBO,
  TodoModelCreateParamsBO,
  TodoModelUpdateParamsBO,
} from './todo-model-bo';
import {TodoId} from './todo-model-index';
import {ParseError} from '@effect/schema/ParseResult';
import {NoSuchElementException} from 'effect/Cause';

const makeTodoService = Effect.gen(function* () {
  const repository = yield* TodoRepository;

  const createTodo = (
    params: TodoModelCreateParamsBO
  ): Effect.Effect<TodoId, never, never> => repository.createTodo(params);

  const deleteTodo = (id: TodoId): Effect.Effect<boolean, never, never> =>
    repository.deleteTodo(id);

  const getTodo = (
    id: TodoId
  ): Effect.Effect<TodoModelBO, NoSuchElementException | ParseError, never> =>
    repository.getTodo(id);

  const getTodos = (): Effect.Effect<TodoModelBO[], never, never> =>
    repository.getTodos();

  const updateTodo = (
    id: TodoId,
    params: TodoModelUpdateParamsBO
  ): Effect.Effect<TodoModelBO, TodoUpdateError, never> =>
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
