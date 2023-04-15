import express, { Request, Response } from 'express';
import knex from 'knex';
import knexConfig from '../knexfile';

const db = knex(knexConfig.development);
const router = express.Router();

// create an attribute
router.post('/create-attribute', async (req: Request, res: Response) => {
  const { name } = req.body;
  const attribute = await db('attributes').insert({ name });
  res.send(attribute);
});

// get all attributes
router.get('/', async (req: Request, res: Response) => {
  const attributes = await db('attributes').select('*');
  res.send(attributes);
});

// get a single attrribute
router.get('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const attribute = await db('attributes').select('*').where({ id }).first();
  if (!attribute) {
    return res.status(404).send({ error: 'Category not found' });
  }
  res.send(attribute);
});

// update an attribute
router.put('/update-attribute/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name } = req.body;
  const attribute = await db('attributes').where({ id }).update({ name });
  if (!attribute) {
    return res.sendStatus(404);
  }
  const updatedAttribute = await db('attributes').where({ id }).first();
  res.send(updatedAttribute);
});

// delete an attribute with all its child
router.delete('/delete-attribute/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const attribute = await db('attributes').where({ id }).delete();
  if (!attribute) {
    return res.sendStatus(404);
  }
  res.send({ message: 'Attribute deleted successfully' });
});

export default router;