import Fastify from 'fastify'
import cors from '@fastify/cors';
import categoryRoutes from './routes/categoriesRoutes'
import productRoutes from './routes/productsRoutes';
import fotoRoutes from './routes/fotoRoutes';
import multer from 'fastify-multer';
import fastifyMultipart from '@fastify/multipart' //?


const server = Fastify({ logger: true })

server.get('/', async (request, reply) => {
  return 'api\n'
})

server.register(cors, {
  origin: 'http://localhost:5173'
})
server.register(categoryRoutes, { prefix: '/categories' })
server.register(productRoutes, { prefix: '/products' })
server.register(multer.contentParser)
server.register(fotoRoutes, { prefix: '/foto' })

server.listen({ port: 8080 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
