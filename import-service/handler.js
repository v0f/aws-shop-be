const aws = require('aws-sdk');
const csv = require('csv-parser');

const BUCKET = 'coffeeshop-import-csv';

module.exports = {
    importProductsFile: async (event) => {
        try {
            const s3 = new aws.S3({ region: 'eu-west-1', signatureVersion: 'v4' });
            const fileName = event.queryStringParameters.name;
            const params = {
                Bucket: BUCKET,
                Key: `uploaded/${fileName}`,
                Expires: 60,
                ContentType: 'text/csv'
            };
            const headers = {
                'Content-Type': 'text/plain',
                'Access-Control-Allow-Origin': '*'
            };

            const url = await s3.getSignedUrlPromise('putObject', params);
            console.log('SignedUrl', url);
            return {
                statusCode: 200,
                headers: headers,
                body: url
            };
        } catch(e) {
            return {
                statusCode: 500,
                headers: headers,
                body: e.message
            }
        };
    },
    importFileParser: async (event) => {
        try {
            const s3 = new aws.S3({ region: 'eu-west-1', signatureVersion: 'v4' });
            for (const record of event.Records) {
                const s3Stream = s3.getObject({
                    Bucket: BUCKET,
                    Key: record.s3.object.key,
                }).createReadStream();

                s3Stream.pipe(csv())
                .on('data', (data) => { console.log(data) })
                .on('end', async () => {
                    try {
                        await s3.copyObject({
                            Bucket: BUCKET,
                            CopySource: BUCKET + '/' + record.s3.object.key,
                            Key: record.s3.object.key.replace('uploaded', 'parsed')
                        }).promise();
                        await s3.deleteObject({
                            Bucket: BUCKET,
                            Key: record.s3.object.key
                        }).promise();
                    } catch(e) {
                        console.log('s3 file move error: ', e.message);
                    }
                });
            }
        } catch(e) {
            console.log('importFileParser error: ', e.message);
        };
    }
}