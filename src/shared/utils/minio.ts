import { MinioService } from 'nestjs-minio-client';

/**
 * Set up a bucket in the Minio service and apply the specified policy.
 *
 * @param {MinioService} minio - the Minio service instance
 * @param {object} policy - the policy to be applied to the bucket
 * @return {void}
 */
export const setUpBucket = (minio: MinioService, policy?: object) => {
  minio.client.bucketExists(
    process.env.MINIO_BUCKET_NAME,
    function (err, exists) {
      if (err) throw err;
      if (!exists) {
        minio.client.makeBucket(
          process.env.MINIO_BUCKET_NAME,
          'us-east-1',
          (err) => {
            if (err) return console.log('Error creating bucket.', err);
          },
        );
      }
      if (policy) {
        minio.client.setBucketPolicy(
          process.env.MINIO_BUCKET_NAME,
          JSON.stringify(policy),
          (error) => {
            if (error) throw error;
            console.log('Bucket policy set');
          },
        );
      }
    },
  );
};
