// read more: https://github.com/Effect-TS/effect/blob/main/packages/schema/README.md

import {Brand} from 'effect';
import {Int, Positive} from '../lib';

/**
 * TodoId is a function to generate Todo Id.
 */
export const TodoId = Brand.all(Int, Positive);
export type TodoId = Brand.Brand.FromConstructor<typeof TodoId>;
