import { FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../prismaClient';


interface CategoryCreateData {
  name: string;
  picture: string;
  parent_id: number;
  created_at: Date;
  updated_at: Date;
}

export const createCategory = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const newCategory = await prisma.category.create({
      data: request.body as CategoryCreateData,
    });
    reply.send(newCategory);
  } catch (error) {
    reply.status(500).send(error);
  }
};

interface CategoryWithChildren {
  id: number;
  name: string;
  picture: string | null;
  parent_id: number | null;
  created_at: Date;
  updated_at: Date;
  parent?: CategoryWithChildren;
  children?: CategoryWithChildren[];
}
export const getCategories = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const buildCategoryTree = (
      categories: CategoryWithChildren[],
      parentId: number | null = null
    ): CategoryWithChildren[] => {

      const categoryTree: CategoryWithChildren[] = [];
      for (const category of categories) {
        if (category.parent_id === parentId) {
          const children = buildCategoryTree(categories, category.id);
          if (children.length > 0) {
            category.children = children;
          }
          categoryTree.push(category);
        }
      }
      return categoryTree;
    };

    const allCategories = await prisma.category.findMany({
      include: {
        children: true,
        products: {
          select: { id: true, },
        },
      }
    });

    //reply.send(allCategories);
    const categoryTree = buildCategoryTree(allCategories);

    reply.send(categoryTree);
  } catch (error) {
    reply.status(500).send(error);
  }
};

export const getCategoryById = async (
  request: FastifyRequest<{ Params: { id: number } }>,
  reply: FastifyReply
) => {
  const categoryId = parseInt(request.params.id.toString());

  try {
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      reply.status(404).send({ message: 'Category not found' });
    } else {
      reply.send(category);
    }
  } catch (error) {
    reply.status(500).send(error);
  }
};

export const getCategoryByIdWitParent = async (
  request: FastifyRequest<{ Params: { id: number } }>,
  reply: FastifyReply
) => {
  let categoryId = parseInt(request.params.id.toString());

  const category_list = []
  let category: any
  try {
    do {
      category = await prisma.category.findFirst({
        where: { id: categoryId },
      });

      if (!category) {
        reply.status(404).send({ message: 'Category not found' });
        break
      }

      categoryId = category.parent_id

      categoryId && category_list.push(categoryId)
    } while (category.parent_id != null)

    reply.send(category_list);
  } catch (error) {
    reply.status(500).send(error);
  }
};

export const updateCategory = async (
  request: FastifyRequest<{ Params: { id: number } }>,
  reply: FastifyReply
) => {
  const categoryId = parseInt(request.params.id.toString());

  const updatedCategoryData = request.body;

  try {
    const updatedCategory = await prisma.category.update({
      where: { id: categoryId },
      data: updatedCategoryData as CategoryCreateData,
    });

    reply.send(updatedCategory);
  } catch (error) {
    reply.status(500).send(error);
  }
};

export const deleteCategory = async (
  request: FastifyRequest<{ Params: { id: number } }>,
  reply: FastifyReply
) => {
  const categoryId = parseInt(request.params.id.toString());


  try {
    const deletedCategory = await prisma.category.delete({
      where: { id: categoryId },
    });

    reply.send(deletedCategory);
  } catch (error) {
    reply.status(500).send(error);
  }
};
