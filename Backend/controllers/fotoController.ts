import fastify, { FastifyRequest, FastifyReply } from 'fastify';
import fs from 'fs-extra';
import multer from 'fastify-multer';
//import multer from 'multer'
import sharp from 'sharp';
import path from 'path';
import fastifyStatic from '@fastify/static';
import fastifyMultipart from '@fastify/multipart'

// PHOTO CONTROLLER

// Get photos from the server
export const getPhotos = async (req: FastifyRequest<{ Params: { photoID: number, TYPE: string, photoName: string } }>, res: FastifyReply) => {
  const type = req.params.TYPE;
  const photoId = req.params.photoID;
  const photoName = req.params.photoName;

  try {
    const filePath = path.join(__dirname, `../uploads/${type}/${photoId}/${photoName}`);
    const fileStream = fs.createReadStream(filePath);

    return res.send(fileStream);
  } catch (error) {
    return res.send('Failed to retrieve the photo');
  }
};

export const resizePhoto = async (req: FastifyRequest<{ Params: { photoID: number, TYPE: string } }>, res: FastifyReply) => {
  try {
    if (!req.file) {
      return res.status(400).send({ message: 'No file uploaded.' });
    }

    // Get the file's path
    const filePath = (req.file as any).path;

    // Resize the uploaded image to your desired dimensions
    const resizedImageBuffer = await sharp(filePath)
      .resize(3200, 3200) // Resize to 3200x3200 pixels
      .toBuffer();

    console.log("resizedImageBuffer",resizedImageBuffer)

    // Overwrite the original image with the resized version
    await sharp(resizedImageBuffer).toFile(filePath);

    res.code(200).send('Image uploaded and resized successfully.');
  } catch (error) {
    console.error('Error uploading and resizing image:', error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
}

// Delete a photo from the server
export const deletePhoto = async (req: FastifyRequest<{ Params: { photoID: number, TYPE: string, photoName: string } }>, res: FastifyReply) => {
  const type = req.params.TYPE;
  const photoId = req.params.photoID;
  const photoName = req.params.photoName;

  try {
    fs.remove(`./uploads/${type}/${photoId}/${photoName}`, (err: any) => {
      if (err && err.code == 'ENOENT') {
        res.send('The file does not exist, so it cannot be removed.');
      } else if (err) {
        res.send('An error occurred while attempting to remove the file.');
      } else {
        res.send('The file has been removed.');
      }
    });
  } catch (error: any) {
    return res.send('Failed to delete the photo');
  }
};

// Delete a folder from the server (possibly can be combined with the above function)
export const deleteFolder = async (req: FastifyRequest<{ Params: { photoID: number, TYPE: string } }>, res: FastifyReply) => {
  const type = req.params.TYPE;
  const photoId = req.params.photoID;

  try {
    fs.remove(`./uploads/${type}/${photoId}`)
      .then(() => {
        res.send({ message: 'The folder has been removed.' });
      })
      .catch((err: any) => {
        if (err && err.code == 'ENOENT') {
          res.send({ message: 'The folder does not exist, so it cannot be removed.' });
        } else if (err) {
          res.send({ message: 'An error occurred while attempting to remove the folder.' });
        }
      });
  } catch (error) {
    return res.send({ message: 'Failed to delete the folder' });
  }
};
