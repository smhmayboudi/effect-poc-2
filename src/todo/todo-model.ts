import {Schema} from '@effect/schema';
import {Brand, pipe} from 'effect';
import {Int, Positive} from '../lib';

/**
 * TodoId is a function to generate Todo Id.
 */
export const TodoId = Brand.all(Int, Positive);
export type TodoId = Brand.Brand.FromConstructor<typeof TodoId>;

/**
 * Todo is a Data Access Object - DAO.
 */
export class Todo extends Schema.Class<Todo>('TodoModel')({
  id: pipe(Schema.Number, Schema.fromBrand(TodoId)),
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
