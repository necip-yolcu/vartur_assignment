import { FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../prismaClient';


interface ProductCreateData {
  name: string;
  category_id: number;
  created_at: Date;
  updated_at: Date;
}

export const createProduct = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    console.log("urunler:",request.body)
    const newProduct = await prisma.product.create({
      data: request.body as ProductCreateData,
    });
    reply.send(newProduct);
  } catch (error) {
    reply.status(500).send(error);
  }
};

export const getProducts = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const products = await prisma.product.findMany();
    reply.send(products);
  } catch (error) {
    reply.status(500).send(error);
  }
};

export const getProductById = async (request: FastifyRequest<{ Params: { id: number } }>, reply: FastifyReply) => {
  const productId = parseInt(request.params.id.toString());
  
  try {
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      reply.status(404).send({ message: 'Product not found' });
    } else {
      reply.send(product);
    }
  } catch (error) {
    reply.status(500).send(error);
  }
};

export const updateProduct = async (request: FastifyRequest<{ Params: { id: number } }>, reply: FastifyReply) => {
  const productId = parseInt(request.params.id.toString());
  const updatedProductData = request.body;
  
  try {
    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: updatedProductData as ProductCreateData,
    });

    reply.send(updatedProduct);
  } catch (error) {
    reply.status(500).send(error);
  }
};

export const deleteProduct = async (request: FastifyRequest<{ Params: { id: number } }>, reply: FastifyReply) => {
  const productId = parseInt(request.params.id.toString());
  
  try {
    const deletedProduct = await prisma.product.delete({
      where: { id: productId },
    });
    
    reply.send(deletedProduct);
  } catch (error) {
    reply.status(500).send(error);
  }
};
