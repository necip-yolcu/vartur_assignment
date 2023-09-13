import fastify, { FastifyRequest, FastifyReply } from 'fastify';
import fs from 'fs-extra';
import multer from 'fastify-multer';
//import multer from 'multer'
import sharp from 'sharp';
import path from 'path';
import fastifyStatic from '@fastify/static';
import fastifyMultipart from '@fastify/multipart'

// PHOTO CONTROLLER

// Upload a photo to the server (to the 'uploads' folder)
// 1-else error handling
// 2-path exist controller
export const addPhoto = async (req: FastifyRequest<{ Params: { photoID: number, TYPE: string } }>, res: FastifyReply) => {
  //res.send("Photo uploaded successfully");
}

// Get photos from the server
export const getPhotos = async (req: FastifyRequest<{ Params: { photoID: number, TYPE: string, photoName: string } }>, res: FastifyReply) => {
  console.log("photo_backend_HELLO GET")

  const type = req.params.TYPE;
  const photoId = req.params.photoID;
  const photoName = req.params.photoName;

  try {
    const filePath = path.join(__dirname, `./uploads/${type}/${photoId}/${photoName}`);
    const fileStream = fs.createReadStream(filePath);

    res.send(fileStream);
  } catch (error) {
    return res.send('Failed to retrieve the photo');
  }
};

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
