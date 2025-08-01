import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import busboy from 'busboy';

dotenv.config();

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
});

export default async function streamAndUpload (req, res) {
    try {
        const contentType = req.headers['content-type']; 
        
        if (!contentType || !contentType.includes('multipart/form-data')){
            return res.status(400).send({ error: 'Invalid content type' });
        }

        const busboyInstance = busboy({ headers: req.headers });

        busboyInstance.on('file', (name, stream, info) => {
            const { filename, mimeType } = info;
            console.log('File: ', filename, '\nType: ', mimeType);
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: 'plants',
                    public_id: filename,
                    resource_type: 'auto',
                    tags: ['plants']
                },
                (error, result) => {
                    if (error) {
                        console.log(error);
                        return res.status(500).send({ error: 'Upload failed' });
                    }
                    console.log(result);
                    return res.status(200).send({ url: result.url });
                }
            );
            
            // Fixed: pipe the stream to uploadStream
            stream.pipe(uploadStream);
        });

        busboyInstance.on('finish', () => {
            console.log('Upload finished');
        });

        req.pipe(busboyInstance);
    } catch (error) {
        console.log(error);
        return res.status(500).send({ error: 'Upload failed' });
    }
}