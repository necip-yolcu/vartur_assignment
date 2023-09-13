import { FastifyInstance } from 'fastify';
import {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
} from '../controllers/productsController';

const productRoutes = (fastify: FastifyInstance, options: any, done: () => void) => {
    fastify.post('/', createProduct);

    fastify.get('/', getProducts);
    fastify.get<{ Params: { id: number } }>
        ('/:id', getProductById);

    fastify.put<{ Params: { id: number } }>
        ('/:id', updateProduct);

    fastify.delete<{ Params: { id: number } }>
        ('/:id', deleteProduct); // Handle DELETE requests for deleting a product by ID

    done();
};

export default productRoutes;
