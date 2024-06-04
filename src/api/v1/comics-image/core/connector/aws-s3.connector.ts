import {
    S3Client,
    PutObjectCommand,
    GetObjectCommand,
    ServiceOutputTypes,
    DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export default class AWSConnectorS3 {
    private readonly s3Client: S3Client;
    private readonly bucketName: string;

    constructor() {
        this.bucketName = process.env.S3_BUCKET_NAME;
        this.s3Client = new S3Client({
            credentials: {
                accessKeyId: process.env.S3_ACCESS_KEY_ID,
                secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
            },
            endpoint: process.env.S3_END_POINT,
            forcePathStyle: true,
            region: 'us-east-1',
        });
    }

    saveFile(fileName: string, file: Buffer): Promise<ServiceOutputTypes> {
        return this.s3Client
            .send(
                new PutObjectCommand({
                    Bucket: this.bucketName,
                    Key: fileName,
                    Body: file,
                }),
            )
            .then((data) => data)
            .catch((error) => Promise.reject(new Error(error.message)));
    }

    getFile(fileName: string): Promise<string> {
        return getSignedUrl(
            this.s3Client,
            new GetObjectCommand({
                Bucket: this.bucketName,
                Key: fileName,
            }),
            { expiresIn: 3600 },
        ).catch((error) => Promise.reject(new Error(error.message)));
    }

    deleteFile(fileName: string): Promise<boolean> {
        return this.s3Client
            .send(
                new DeleteObjectCommand({
                    Bucket: this.bucketName,
                    Key: fileName,
                }),
            )
            .then(() => true)
            .catch((error) => Promise.reject(new Error(error.message)));
    }
}
