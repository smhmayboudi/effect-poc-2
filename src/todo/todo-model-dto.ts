// read more: https://github.com/Effect-TS/effect/blob/main/packages/schema/README.md

import {Schema} from '@effect/schema';
import {pipe} from 'effect';

/**
 * TodoCreateParamsDTO is a Data Transmit Object - DTO.
 */
export class TodoCreateParamsDTO extends Schema.Struct({
  completed: Schema.Number,
  title: Schema.String,
}) {}

/**
 * TodoUpdateParamsDTO is a Data Transmit Object - DTO.
 */
export class TodoUpdateParamsDTO extends Schema.Struct({
  completed: pipe(Schema.Number, Schema.partial()),
  title: pipe(Schema.String, Schema.partial()),
}) {}
