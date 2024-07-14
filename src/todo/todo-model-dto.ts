// read more: https://github.com/Effect-TS/effect/blob/main/packages/schema/README.md

import {Schema, Serializable} from '@effect/schema';
import {pipe} from 'effect';
import {TodoModelBO} from './todo-model-bo';
import {TodoId} from '../lib';

/**
 * TodoModelDTO is a Data Transmit Object - DTO.
 */

export class TodoModelDTO extends Schema.Class<TodoModelDTO>('TodoModelDTO')({
  id: Schema.Number,
  title: Schema.String,
  completed: Schema.Number,
}) {
  static TransformFrom = Schema.transform(TodoModelBO, TodoModelDTO, {
    decode: fromA =>
      new TodoModelDTO({
        ...fromA,
        completed: fromA.completed ? 1 : 0,
      }),
    encode: toI =>
      new TodoModelBO({
        ...toI,
        id: TodoId(toI.id),
        completed: toI.completed === 1,
      }),
  });

  get [Serializable.symbol]() {
    return TodoModelDTO.TransformFrom;
  }
}

/**
 * TodoModelCreateParamsDTO is a Data Transmit Object - DTO.
 */
export class TodoModelCreateParamsDTO extends Schema.Class<TodoModelCreateParamsDTO>(
  'TodoModelCreateParamsDTO'
)({
  title: Schema.String,
  completed: Schema.Number,
}) {}

/**
 * TodoModelUpdateParamsDTO is a Data Transmit Object - DTO.
 */
export class TodoModelUpdateParamsDTO extends Schema.Class<TodoModelUpdateParamsDTO>(
  'TodoModelUpdateParamsDTO'
)({
  title: pipe(Schema.String, Schema.partial()),
  completed: pipe(Schema.Number, Schema.partial()),
}) {}
