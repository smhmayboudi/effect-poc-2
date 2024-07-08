import {Data} from 'effect';

export class TodoUpdateError extends Data.TaggedError('TodoUpdateError')<{
  message: string;
}> {}
