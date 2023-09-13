import { FastifyRequest, FastifyReply } from 'fastify';
import multer from 'fastify-multer';
import fs from 'fs-extra';


const myStorage = multer.diskStorage({
    destination: async (req: any, file: any, callback: (arg0: null, arg1: string) => void) => {
        const { TYPE, photoID } = req.params

        if (await fs.pathExists(`./uploads/${TYPE}/${photoID}`))
            callback(null, `./uploads/${TYPE}/${photoID}`);
        else
            fs.mkdirs(`./uploads/${TYPE}/${photoID}`, function (err: any) {
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

export default fieldsUpload;


