import { FastifyInstance, RouteShorthandOptions } from 'fastify';
import { createCategory, deleteCategory, getCategories, getCategoryById, getCategoryByIdWitParent, updateCategory } from '../controllers/categoriesController';

const categoryRoutes = (fastify: FastifyInstance, options: any, done: () => void) => {
    fastify.post('/', createCategory);

    fastify.get('/', getCategories);
    fastify.get<{ Params: { id: number } }>('/:id', getCategoryById);
    fastify.get<{ Params: { id: number } }>('/parent/:id', getCategoryByIdWitParent);

    fastify.put<{ Params: { id: number } }>('/:id', updateCategory);

    fastify.delete<{ Params: { id: number } }>('/:id', deleteCategory);

    done();
};

export default categoryRoutes;
