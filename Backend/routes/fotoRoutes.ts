import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import {
  resizePhoto,
  getPhotos,
  deleteFolder
} from '../controllers/fotoController';
import fotoUpload from '../controllers/fotoController';


const fotoRoutes = (fastify: FastifyInstance, options: any, done: () => void) => {
  // Add a foto
  fastify.post<{ Params: { TYPE: string; photoID: number } }>
    (
      '/addFoto/:TYPE/:photoID',
      { preHandler: fotoUpload },
      resizePhoto
    );

  // Update a foto
  fastify.post<{ Params: { TYPE: string; photoID: number } }>
    (
      '/updateFoto/:TYPE/:photoID',
      { preHandler: fotoUpload },
      resizePhoto
    );

  // Get fotos
  fastify.get<{ Params: { TYPE: string; photoID: number; photoName: string } }>
    ('/uploads/:TYPE/:photoID/:photoName', getPhotos);

  // Delete folder
  fastify.delete<{ Params: { TYPE: string; photoID: number } }>
    ('/deleteFolder/:TYPE/:photoID', deleteFolder);

  done();
};

export default fotoRoutes;
