import express, { Request, Response } from 'express';
import knex from 'knex';
import knexConfig from '../knexfile';
import { Product } from './types/productType';

const db = knex(knexConfig.development);
const router = express.Router();

// POST /products
router.post('/create-product', async (req: Request, res: Response) => {
  const productData = req.body as Product;

  // insert the product into the "products" table
  const [productId] = await db('products').insert({
    name: productData.name,
    price: productData.price,
    description: productData.description,
    is_active: productData.is_active,
  });

  // insert the product's categories into the "product_categories" junction table
  const categoryIds = productData.categories?.map((category) => category.id);
  if (categoryIds) {
    await db('product_categories').insert(
      categoryIds.map((categoryId) => ({
        product_id: productId,
        category_id: categoryId,
      }))
    );
  }

  // insert the product's attributes into the "product_attributes" junction table
  const attributeValueIds = productData.attributes?.map((attribute) => attribute.id);
  console.log("attributeValueIds", attributeValueIds);

  const attributeIds = await Promise.all((attributeValueIds || []).map(async (attributeValue) => {
    const result = await db('attribute_values').select('attribute_id').where({ id: attributeValue }).first();
    return result?.attribute_id;
  }));

  console.log("attributeIds", attributeIds);
  if (attributeValueIds && attributeIds ) {
    await db('product_attributes').insert(
      attributeValueIds.map((attributeValueId, index) => ({
        product_id: productId,
        attribute_id: attributeIds[index],
        attribute_value_id: attributeValueId
      }))
    );
  }

  res.send({ message: 'Product created successfully!' });
});

// Get all products by category and status
router.get('/', async (req, res) => {

  try {
    const products = await db("products")
    .select(
    "products.id",
    "products.name as product_name",
    "products.price",
    "products.description",
    "products.is_active as product_active",
    "products.created_at",
    "products.updated_at",
    "categories.id as category_id",
    "categories.name as category_name",
    "attributes.name as attribute_name",
    "attribute_values.value as attribute_value"
  )
  .leftJoin("product_categories", "products.id", "product_categories.product_id")
  .leftJoin("categories", "product_categories.category_id", "categories.id")
  .leftJoin("product_attributes", "products.id", "product_attributes.product_id")
  .leftJoin("attributes", "product_attributes.attribute_id", "attributes.id")
  .leftJoin("attribute_values", "product_attributes.attribute_value_id", "attribute_values.id");

    const result: Product[] = Object.values(products.reduce((acc: Record<number, Product>, product: any) => {
      const productId = product.id;
      console.log(product);

      if (!acc[productId]) {
        acc[productId] = {
          id: product.id,
          name: product.product_name,
          price: product.price,
          description: product.description,
          is_active: product.is_active,
          categories: [product.category_name],
          attributes: [product.attribute_value],
          created_at: product.created_at,
          updated_at: product.updated_at,
        };
      } 
      else {
        if(!acc[productId].categories?.find(category => category === product.category_name)) {
          acc[productId].categories?.push(product.category_name);
        }
        if(!acc[productId].attributes?.find(attribute => attribute === product.attribute_value)) {
          acc[productId].attributes?.push(product.attribute_value);
        }
      }
      return acc;
    }, {}));

    res.json(Object.values(result));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get all products by category and status
router.get('/category-status', async (req, res) => {
  const { category, status } = req.query;
  try {
    const products = await db
      .select('products.*')
      .from<Product>('products')
      .leftJoin('product_categories', 'products.id', 'product_categories.product_id')
      .leftJoin('categories', 'product_categories.category_id', 'categories.id')
      .where('categories.name', category)
      .andWhere('products.is_active', status === '1')
      .groupBy('products.id', 'product_categories.category_id');
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error getting products' });
  }
});

// delete a product
router.delete('/delete-product/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await db('products').where({ id }).del();
  if (result === 0) {
    res.status(404).json({ message: 'Product not found' });
  } else {
    res.status(200).json({ message: 'Product deleted successfully' });
  }
});

export default router;
