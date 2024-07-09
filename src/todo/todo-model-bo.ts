// read more: https://github.com/Effect-TS/effect/blob/main/packages/schema/README.md

import {Schema, Serializable} from '@effect/schema';
import {TodoCreateParamsDTO, TodoUpdateParamsDTO} from './todo-model-dto';
import {pipe} from 'effect';

/**
 * TodoCreateParamsBO is a Business Object - BO.
 */
// export const TodoCreateParamsBO = pipe(
//   Schema.Struct(Todo.fields),
//   Schema.omit('id')
// );
// export type TodoCreateParamsBO = typeof TodoCreateParamsBO.Type;
export class TodoCreateParamsBO extends Schema.Class<TodoCreateParamsBO>(
  'TodoCreateParamsBO'
)({
  title: Schema.String,
  completed: Schema.Boolean,
}) {
  static FromEncoded = Schema.transform(
    TodoCreateParamsDTO,
    TodoCreateParamsBO,
    {
      decode: ({completed, title}) => ({completed: completed === 1, title}),
      encode: ({completed, title}) => ({completed: completed ? 1 : 0, title}),
    }
  );

  get [Serializable.symbol]() {
    return TodoCreateParamsBO.FromEncoded;
  }
}

/**
 * TodoUpdateParamsBO is a Business Object - BO.
 */
// export const TodoUpdateParamsBO = pipe(
//   Schema.partial(Schema.Struct(Todo.fields), {exact: true}),
//   Schema.omit('id')
// );
// export type TodoUpdateParamsBO = typeof TodoUpdateParamsBO.Type;
export class TodoUpdateParamsBO extends Schema.Class<TodoUpdateParamsBO>(
  'TodoUpdateParamsBO'
)({
  title: pipe(Schema.String, Schema.partial()),
  completed: pipe(Schema.Boolean, Schema.partial()),
}) {
  static FromEncoded = Schema.transform(
    TodoUpdateParamsDTO,
    TodoUpdateParamsBO,
    {
      decode: ({completed, title}) => ({completed: completed === 1, title}),
      encode: ({completed, title}) => ({completed: completed ? 1 : 0, title}),
    }
  );

  get [Serializable.symbol]() {
    return TodoUpdateParamsBO.FromEncoded;
  }
}
