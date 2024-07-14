import {
  Array,
  Context,
  Effect,
  HashMap,
  Layer,
  Option,
  Ref,
  pipe,
} from 'effect';
import {TodoUpdateError} from './todo-error';
import {
  TodoModelBO,
  TodoModelCreateParamsBO,
  TodoModelDAO,
  TodoModelUpdateParamsBO,
} from './todo-model-index';
import {TodoId} from '../lib';
import {Schema} from '@effect/schema';
import {NoSuchElementException} from 'effect/Cause';
import {ParseError} from '@effect/schema/ParseResult';

const makeTodoRepository = Effect.gen(function* () {
  const nextIdRef = yield* Ref.make(TodoId(1));
  const todosRef = yield* Ref.make(HashMap.empty<TodoId, TodoModelDAO>());

  const createTodo = (
    params: TodoModelCreateParamsBO
  ): Effect.Effect<TodoId, never, never> =>
    pipe(
      Ref.getAndUpdate(nextIdRef, n => TodoId(n + 1)),
      Effect.flatMap(id =>
        Ref.modify(todosRef, map => {
          const newTodoDAO = new TodoModelDAO({...params, id: TodoId(id)});
          const updated = HashMap.set(map, newTodoDAO.id, newTodoDAO);
          return [newTodoDAO.id, updated];
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
  ): Effect.Effect<TodoModelBO, NoSuchElementException | ParseError, never> =>
    pipe(
      Ref.get(todosRef),
      Effect.flatMap(HashMap.get(id)),
      Effect.flatMap(
        Schema.decode(TodoModelBO.TransformFrom, {
          errors: 'all',
          propertyOrder: 'original',
          onExcessProperty: 'error',
          exact: false,
        })
      )
    );

  const getTodos = (): Effect.Effect<TodoModelBO[], never, never> =>
    pipe(
      Ref.get(todosRef),
      Effect.map(map =>
        Array.fromIterable(HashMap.values(map)).map(dao =>
          Schema.decodeSync(TodoModelBO.TransformFrom, {
            errors: 'all',
            propertyOrder: 'original',
            onExcessProperty: 'error',
            exact: true,
          })(dao)
        )
      )
    );

  const updateTodo = (
    id: TodoId,
    params: TodoModelUpdateParamsBO
  ): Effect.Effect<TodoModelBO, TodoUpdateError, never> =>
    pipe(
      Ref.get(todosRef),
      Effect.flatMap(map => {
        const maybeTodo = HashMap.get(map, id);
        if (Option.isNone(maybeTodo)) {
          return new TodoUpdateError({
            message: `the object with todo id ${id} is not available.`,
          });
        }
        const newTodoDAO = new TodoModelDAO({...maybeTodo.value, ...params});
        const updated = HashMap.set(map, id, newTodoDAO);
        const newTodoBO = Schema.decodeSync(TodoModelBO.TransformFrom, {
          errors: 'all',
          propertyOrder: 'original',
          onExcessProperty: 'error',
          exact: true,
        })(newTodoDAO);

        return pipe(Ref.set(todosRef, updated), Effect.as(newTodoBO));
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
