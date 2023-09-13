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

const buildCategoryTree = (categories: any[]) => {
  const categoryTree: any[] = [];

  // Helper function to recursively add children to a category
  const addChildren = (category: { id: any; children: any[]; }) => {
    const children = categories.filter((c) => c.parent_id === category.id);
    children.forEach((child) => {
      const childWithChildren = { ...child, children: [] };
      category.children.push(childWithChildren);
      addChildren(childWithChildren); // Recursively add children to this child
    });
  };

  // Find root categories (those without parents)
  const rootCategories = categories.filter((category) => !category.parent_id);

  rootCategories.forEach((rootCategory) => {
    categoryTree.push(rootCategory);
    addChildren(rootCategory); // Recursively add children to root categories
  });

  return categoryTree;
};



export const getCategories2 = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const allCategories = await prisma.category.findMany({
      where: { parent_id: null }, // Filter for top-level categories (categories without a parent)
      include: {
        children: true
      },
    });

    //console.log("allCTG:", JSON.stringify(allCategories, undefined, 2))
    //const categoryTree = buildCategoryTree(allCategories);
    //console.log("allTREE: ", JSON.stringify(categoryTree, undefined, 2))

    reply.send(allCategories);
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

    const allCategories = await prisma.category.findMany({ include: { children: true } });

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
  console.log("categoryIDD:", categoryId, typeof categoryId)

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
