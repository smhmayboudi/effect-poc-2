import {Brand} from 'effect';

export type Int = number & Brand.Brand<'Int'>;
export const Int = Brand.refined<Int>(
  n => Number.isInteger(n),
  n => Brand.error(`expected ${n} to be an integer.`)
);

export type Positive = number & Brand.Brand<'Positive'>;
export const Positive = Brand.refined<Positive>(
  n => n >= 0,
  n => Brand.error(`expected ${n} to be positive.`)
);
