import {Schema} from '@effect/schema';
import {pipe} from 'effect';

/**
 * Todo is a Data Access Object - DAO.
 */
export class Todo extends Schema.Class<Todo>('Todo')({
  id: Schema.Number,
  title: Schema.String,
  completed: Schema.Boolean,
}) {}

/**
 * TodoCreateParams is a Business Object - BO.
 */
export const TodoCreateParams = pipe(
  Schema.Struct(Todo.fields),
  Schema.omit('id')
);
export type TodoCreateParams = typeof TodoCreateParams.Type;

/**
 * TodoUpdateParams is a Business Object - BO.
 */
export const TodoUpdateParams = pipe(
  Schema.partial(Schema.Struct(Todo.fields), {exact: true}),
  Schema.omit('id')
);
export type TodoUpdateParams = typeof TodoUpdateParams.Type;
