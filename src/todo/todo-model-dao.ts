// read more: https://github.com/Effect-TS/effect/blob/main/packages/schema/README.md

import {Schema} from '@effect/schema';
import {pipe} from 'effect';
import {TodoId} from '../lib';

/**
 * TodoModelDAO is a Data Access Object - DAO class.
 */
export class TodoModelDAO extends Schema.Class<TodoModelDAO>('TodoModelDAO')({
  id: pipe(Schema.Number, Schema.fromBrand(TodoId)),
  title: Schema.String,
  completed: Schema.Boolean,
}) {}

// /**
//  * id is a member of Todo class.
//  */
// id: pipe(
//   Schema.Number,
//   Schema.fromBrand(TodoId),
//   Schema.annotations({
//     title: 'title',
//     description: 'a string field',
//     documentation: 'a positive integer number.',
//     examples: [TodoId(1)],
//     // default: TodoId(),
//   })
// ),
// /**
//  * title is a member of Todo class.
//  */
// title: pipe(
//   Schema.String,
//   Schema.pattern(/^\w+$/, {
//     message: () => 'must be characters.',
//   }),
//   Schema.minLength(3, {message: () => 'must be 3 or more characters long.'}),
//   Schema.filter(s => s[0] !== s[1], {
//     message: () => 'the first two characters should not be same.',
//   }),
//   /**
//    * for documentation purpose.
//    */
//   Schema.annotations({
//     title: 'title',
//     description: 'a string field',
//     documentation:
//       'it should be characters, it should be more than 3 character, the first and second character should not be the same.',
//     examples: ['b'],
//     default: '',
//   })
// ),
// /**
//  * completed is a member of Todo class.
//  */
// completed: pipe(
//   Schema.Boolean,
//   /**
//    * for documentation purpose.
//    */
//   Schema.annotations({
//     title: 'title',
//     description: 'a string field',
//     documentation:
//       'it should be characters, it should be more than 3 character, the first and second character should not be the same.',
//     examples: [false, true],
//     default: false,
//   })
// ),
