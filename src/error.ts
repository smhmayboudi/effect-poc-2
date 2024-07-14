import {Data} from 'effect';

export class FeatureFlagError extends Data.TaggedError('FeatureFlagError')<{
  message: string;
}> {}
