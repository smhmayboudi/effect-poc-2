// read more: https://github.com/Effect-TS/effect/blob/main/packages/schema/README.md

import {Schema, Serializable} from '@effect/schema';
import {
  TodoModelCreateParamsDTO,
  TodoModelUpdateParamsDTO,
} from './todo-model-dto';
import {pipe} from 'effect';
import {TodoId} from '../lib';
import {TodoModelDAO} from './todo-model-dao';

/**
 * TodoModelBO is a Business Object - BO class.
 */
export class TodoModelBO extends Schema.Class<TodoModelBO>('TodoModelBO')({
  id: pipe(Schema.Number, Schema.fromBrand(TodoId)),
  title: Schema.String,
  completed: Schema.Boolean,
}) {
  static TransformFrom = Schema.transform(TodoModelDAO, TodoModelBO, {
    decode: fromA => new TodoModelBO({...fromA}),
    encode: toI =>
      new TodoModelDAO({
        ...toI,
        id: TodoId(toI.id),
      }),
  });

  get [Serializable.symbol]() {
    return TodoModelBO.TransformFrom;
  }
}

/**
 * TodoModelCreateParamsBO is a Business Object - BO.
 */
// export const TodoModelCreateParamsBO = pipe(
//   Schema.Struct(Todo.fields),
//   Schema.omit('id')
// );
// export type TodoModelCreateParamsBO = typeof TodoModelCreateParamsBO.Type;
export class TodoModelCreateParamsBO extends Schema.Class<TodoModelCreateParamsBO>(
  'TodoModelCreateParamsBO'
)({
  title: Schema.String,
  completed: Schema.Boolean,
}) {
  static TransformFrom = Schema.transform(
    TodoModelCreateParamsDTO,
    TodoModelCreateParamsBO,
    {
      decode: fromA =>
        new TodoModelCreateParamsBO({
          ...fromA,
          completed: fromA.completed === 1,
        }),
      encode: toI =>
        new TodoModelCreateParamsDTO({
          ...toI,
          completed: toI.completed ? 1 : 0,
        }),
    }
  );

  get [Serializable.symbol]() {
    return TodoModelCreateParamsBO.TransformFrom;
  }
}

/**
 * TodoModelUpdateParamsBO is a Business Object - BO.
 */
// export const TodoModelUpdateParamsBO = pipe(
//   Schema.partial(Schema.Struct(Todo.fields), {exact: true}),
//   Schema.omit('id')
// );
// export type TodoModelUpdateParamsBO = typeof TodoModelUpdateParamsBO.Type;
export class TodoModelUpdateParamsBO extends Schema.Class<TodoModelUpdateParamsBO>(
  'TodoModelUpdateParamsBO'
)({
  title: pipe(Schema.String, Schema.partial()),
  completed: pipe(Schema.Boolean, Schema.partial()),
}) {
  static TransformFrom = Schema.transform(
    TodoModelUpdateParamsDTO,
    TodoModelUpdateParamsBO,
    {
      decode: fromA =>
        new TodoModelUpdateParamsBO({
          ...fromA,
          completed: fromA.completed === 1,
        }),
      encode: toI =>
        new TodoModelUpdateParamsDTO({
          ...toI,
          completed: toI.completed ? 1 : 0,
        }),
    }
  );

  get [Serializable.symbol]() {
    return TodoModelUpdateParamsBO.TransformFrom;
  }
}
