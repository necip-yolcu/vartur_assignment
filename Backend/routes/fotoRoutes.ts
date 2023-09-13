import { FastifyInstance } from 'fastify';
import {
  addPhoto,
  getPhotos,
  deletePhoto,
  deleteFolder
} from '../controllers/fotoController';
import fieldsUpload from '../controllers/upload';


const fotoRoutes = (fastify: FastifyInstance, options: any, done: () => void) => {
  // Add a foto
  fastify.post<{ Params: { TYPE: string; photoID: number } }>
    (
      '/addFoto/:TYPE/:photoID',
      { preHandler: fieldsUpload },
      addPhoto
    );

  // Get fotos
  fastify.get<{ Params: { TYPE: string; photoID: number; photoName: string } }>
    ('/uploads/:TYPE/:photoID/:photoName', getPhotos);

  // Delete foto
  fastify.delete<{ Params: { TYPE: string; photoID: number; photoName: string }; }>
    ('/deleteFoto/:TYPE/:photoID/:photoName', deletePhoto);

  // Delete folder
  fastify.delete<{ Params: { TYPE: string; photoID: number } }>
    ('/deleteFolder/:TYPE/:photoID', deleteFolder);

  done();
};

export default fotoRoutes;
