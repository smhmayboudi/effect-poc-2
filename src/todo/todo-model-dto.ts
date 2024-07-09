// read more: https://github.com/Effect-TS/effect/blob/main/packages/schema/README.md

import {Schema} from '@effect/schema';
import {pipe} from 'effect';
import {TodoModelBO} from './todo-model-bo';
import {TodoId} from './todo-model-index';

/**
 * TodoModelDTO is a Data Transmit Object - DTO.
 */

export class TodoModelDTO extends Schema.Class<TodoModelDTO>('TodoModelDTO')({
  id: Schema.Number,
  title: Schema.String,
  completed: Schema.Number,
}) {
  static FromEncoded = Schema.transform(TodoModelBO, TodoModelDTO, {
    decode: (
      fromA: Schema.Schema.Encoded<typeof TodoModelBO>
    ): Schema.Schema.Encoded<typeof TodoModelDTO> =>
      new TodoModelDTO({
        id: fromA.id,
        title: fromA.title,
        completed: fromA.completed ? 1 : 0,
      }),
    encode: (
      toI: Schema.Schema.Encoded<typeof TodoModelDTO>
    ): Schema.Schema.Type<typeof TodoModelBO> =>
      new TodoModelBO({
        id: TodoId(toI.id),
        title: toI.title,
        completed: toI.completed === 1,
      }),
  });

  // get [Serializable.symbol]() {
  //   return TodoModelDTO.FromEncoded;
  // }
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
