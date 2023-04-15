import express, { Request, Response } from 'express';
import knex from 'knex';
import knexConfig from '../knexfile';

const db = knex(knexConfig.development);
const router = express.Router();

// create a category
router.post('/create-category', async (req: Request, res: Response) => {
  const { name, parent_category_id } = req.body;
  const category = await db('categories').insert({ name, parent_category_id });
  res.send(category);
});

// get all categories
router.get('/', async (req: Request, res: Response) => {
  const categories = await db('categories').select('*');
  res.send(categories);
});

// get a single category
router.get('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const category = await db('categories').select('*').where({ id }).first();
  if (!category) {
    return res.status(404).send({ error: 'Category not found' });
  }
  res.send(category);
});

// update a category
router.put('/update-category/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, parent_category_id } = req.body;
  const category = await db('categories').where({ id }).update({ name, parent_category_id });
  if (!category) {
    return res.sendStatus(404);
  }
  const updatedCategory = await db('categories').where({ id }).first();
  res.send(updatedCategory);
});

// delete a category with all its child
router.delete('/delete-category/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const category = await db('categories').where({ id }).delete();
  if (!category) {
    return res.sendStatus(404);
  }
  res.send({ message: 'Category deleted successfully' });
});

// 4
router.patch('/deactivate/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { is_active } = req.body;

  try {
    await db('categories')
      .where('id', id)
      .orWhere('parent_category_id', id)
      .update({ is_active });

    res.send({ message: `Category ${is_active ? 'activated' : 'deactivated'} successfully` });
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

export default router;
