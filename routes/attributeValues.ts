import express, { Request, Response } from 'express';
import knex from 'knex';
import knexConfig from '../knexfile';
import { AttributeValue } from './types/attributeValueType';

const db = knex(knexConfig.development);
const router = express.Router();

// create an attribute value
router.post('/create-attribute-value', async (req: Request, res: Response) => {
  const attributeValue: AttributeValue = req.body;
  console.log(attributeValue);
  const result = await db('attribute_values').insert(attributeValue);
  attributeValue.id = result[0];
  res.status(201).json(attributeValue);
});

// get all attribute values
router.get('/', async (req: Request, res: Response) => {
  const attributeValues: AttributeValue[] = await db('attribute_values').select('*');
  res.status(200).json(attributeValues);
});

// get a single attribute value
router.get('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const attributeValue: AttributeValue = await db('attribute_values').where({ id }).first();
  if (!attributeValue) {
    return res.status(404).send({ error: 'Category not found' });
  }
  res.send(attributeValue);
});

// update an attribute value
router.put('/update-attribute-value/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const changes: AttributeValue = req.body;
  const result = await db('attribute_values').where({ id }).update(changes);
  if (result === 0) {
    res.status(404).json({ message: 'Attribute value not found' });
  }
  const updatedAttributeValue = await db('attribute_values').where({ id }).first();
  res.send(updatedAttributeValue);
});

// delete an attribute value
router.delete('/delete-attribute-value/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await db('attribute_values').where({ id }).del();
  if (result === 0) {
    res.status(404).json({ message: 'Attribute value not found' });
  } else {
    res.status(200).json({ message: 'Attribute value deleted successfully' });
  }
});

export default router;