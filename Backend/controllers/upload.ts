import { FastifyRequest, FastifyReply } from 'fastify';
import multer from 'fastify-multer';
import fs from 'fs-extra';


const myStorage = multer.diskStorage({
    destination: async (req: any, file: any, callback: (arg0: null, arg1: string) => void) => {
        const { TYPE, photoID } = req.params
        const folderPath = `./uploads/${TYPE}/${photoID}`;

        if (await fs.pathExists(folderPath)) {
            fs.readdir(folderPath, async (err, files) => {
                if (err) {
                    console.error('Error reading directory:', err);
                } else {
                    // Check if there are any files in the folder
                    if (files.length > 0) {

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

const fieldsUpload = multer({ storage: myStorage }).single('uploaded_file')


export default fieldsUpload

