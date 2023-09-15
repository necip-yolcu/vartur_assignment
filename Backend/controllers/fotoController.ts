import { FastifyRequest, FastifyReply } from 'fastify';
import multer from 'fastify-multer';
import sharp from 'sharp';
import fs from 'fs-extra';
import path from 'path';

const myStorage = multer.diskStorage({
  destination: async (req: any, file: any, callback: (arg0: null, arg1: string) => void) => {
      const { TYPE, photoID } = req.params
      const folderPath = `./uploads/${TYPE}/${photoID}`;

      if (await fs.pathExists(folderPath)) {
          fs.readdir(folderPath, async (err, files) => {
              if (err) {
                  console.error('Error reading directory:', err);
              } else {
                  if (files.length > 0) { // Check if there are any files in the folder
                      await fs.remove(folderPath)
                          .then(() => {   //'The folder has been removed.'
                              fs.mkdirs(`./uploads/${TYPE}/${photoID}`, function (err: any) {
                                  if (err)
                                      return console.error(err);
                                  callback(null, `./uploads/${TYPE}/${photoID}`);
                              });
                          })
                          .catch((err: any) => {
                              if (err && err.code == 'ENOENT') {
                                  //res.send({ message: 'The folder does not exist, so it cannot be removed.' });
                              } else if (err) {
                                  //res.send({ message: 'An error occurred while attempting to remove the folder.' });
                              }
                          });
                  } else {    //'The folder is empty.'
                      callback(null, folderPath);
                  }
              }
          });
      } else
          fs.mkdirs(folderPath, function (err: any) {
              if (err)
                  return console.error(err);
              callback(null, `./uploads/${TYPE}/${photoID}`);
          });
  },
  filename: (req: any, file: { originalname: WithImplicitCoercion<string> | { [Symbol.toPrimitive](hint: "string"): string; }; }, callback: (arg0: null, arg1: any) => void) => {
      file.originalname = Buffer.from(file.originalname, 'latin1').toString('utf8');
      callback(null, file.originalname);
  },
});

const fotoUpload = multer({ storage: myStorage }).single('uploaded_file')

export default fotoUpload;

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
