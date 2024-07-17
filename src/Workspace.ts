import {Effect, Exit} from 'effect';
import * as Services from './Services';
// Create a bucket, and define the release function that deletes the bucket if the operation fails.
const createBucket = Services.S3.pipe(
  Effect.andThen(({createBucket, deleteBucket}) =>
    Effect.acquireRelease(createBucket, (bucket, exit) =>
      // The release function for the Effect.acquireRelease operation is responsible for handling the acquired resource (bucket) after the main effect has completed.
      // It is called regardless of whether the main effect succeeded or failed.
      // If the main effect failed, Exit.isFailure(exit) will be true, and the function will perform a rollback by calling deleteBucket(bucket).
      // If the main effect succeeded, Exit.isFailure(exit) will be false, and the function will return Effect.void, representing a successful, but do-nothing effect.
      Exit.isFailure(exit) ? deleteBucket(bucket) : Effect.void
    )
  )
);
// Create an index, and define the release function that deletes the index if the operation fails.
const createIndex = Services.ElasticSearch.pipe(
  Effect.andThen(({createIndex, deleteIndex}) =>
    Effect.acquireRelease(createIndex, (index, exit) =>
      Exit.isFailure(exit) ? deleteIndex(index) : Effect.void
    )
  )
);
// Create an entry in the database, and define the release function that deletes the entry if the operation fails.
const createEntry = (bucket: Services.Bucket, index: Services.Index) =>
  Services.Database.pipe(
    Effect.andThen(({createEntry, deleteEntry}) =>
      Effect.acquireRelease(createEntry(bucket, index), (entry, exit) =>
        Exit.isFailure(exit) ? deleteEntry(entry) : Effect.void
      )
    )
  );
export const make = Effect.scoped(
  Effect.Do.pipe(
    Effect.bind('bucket', () => createBucket),
    Effect.bind('index', () => createIndex),
    Effect.andThen(({bucket, index}) => createEntry(bucket, index))
  )
);
