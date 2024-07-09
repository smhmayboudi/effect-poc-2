// read more: https://github.com/Effect-TS/effect/blob/main/packages/schema/README.md

import {Schema} from '@effect/schema';
import {
  TodoModelCreateParamsDTO,
  TodoModelUpdateParamsDTO,
} from './todo-model-dto';
import {pipe} from 'effect';
import {TodoId} from './todo-model-index';
import {TodoModelDAO} from './todo-model-dao';

/**
 * TodoModelBO is a Business Object - BO class.
 */
export class TodoModelBO extends Schema.Class<TodoModelBO>('TodoModelBO')({
  id: pipe(Schema.Number, Schema.fromBrand(TodoId)),
  title: Schema.String,
  completed: Schema.Boolean,
}) {
  static FromEncoded = Schema.transform(TodoModelDAO, TodoModelBO, {
    decode: (
      fromA: Schema.Schema.Encoded<typeof TodoModelDAO>
    ): Schema.Schema.Encoded<typeof TodoModelBO> =>
      new TodoModelBO({
        id: TodoId(fromA.id),
        title: fromA.title,
        completed: fromA.completed,
      }),
    encode: (
      toI: Schema.Schema.Encoded<typeof TodoModelBO>
    ): Schema.Schema.Type<typeof TodoModelDAO> =>
      new TodoModelDAO({
        id: TodoId(toI.id),
        title: toI.title,
        completed: toI.completed,
      }),
  });

  // get [Serializable.symbol]() {
  //   return TodoModelBO.FromEncoded;
  // }
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
  static FromEncoded = Schema.transform(
    TodoModelCreateParamsDTO,
    TodoModelCreateParamsBO,
    {
      decode: (
        fromA: Schema.Schema.Encoded<typeof TodoModelCreateParamsDTO>
      ): Schema.Schema.Encoded<typeof TodoModelCreateParamsBO> =>
        new TodoModelCreateParamsBO({
          title: fromA.title,
          completed: fromA.completed === 1,
        }),
      encode: (
        toI: Schema.Schema.Encoded<typeof TodoModelCreateParamsBO>
      ): Schema.Schema.Type<typeof TodoModelCreateParamsDTO> =>
        new TodoModelCreateParamsDTO({
          title: toI.title,
          completed: toI.completed ? 1 : 0,
        }),
    }
  );

  // get [Serializable.symbol]() {
  //   return TodoModelCreateParamsBO.FromEncoded;
  // }
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
  static FromEncoded = Schema.transform(
    TodoModelUpdateParamsDTO,
    TodoModelUpdateParamsBO,
    {
      decode: (
        fromA: Schema.Schema.Encoded<typeof TodoModelUpdateParamsDTO>
      ): Schema.Schema.Encoded<typeof TodoModelUpdateParamsBO> =>
        new TodoModelUpdateParamsBO({
          title: fromA.title,
          completed: fromA.completed === 1,
        }),
      encode: (
        toI: Schema.Schema.Encoded<typeof TodoModelUpdateParamsBO>
      ): Schema.Schema.Type<typeof TodoModelUpdateParamsDTO> =>
        new TodoModelUpdateParamsDTO({
          title: toI.title,
          completed: toI.completed ? 1 : 0,
        }),
    }
  );

  // get [Serializable.symbol]() {
  //   return TodoModelUpdateParamsBO.FromEncoded;
  // }
}
