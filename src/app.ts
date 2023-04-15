import express, { Request, Response } from 'express';
import categoriesRouter from '../routes/categories';
import attributesRouter from '../routes/attributes';
import attributeValuesRouter from '../routes/attributeValues';
import productsRouter from '../routes/products';

const app = express();
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

app.use('/categories', categoriesRouter);
app.use('/attributes', attributesRouter);
app.use('/attributeValues', attributeValuesRouter);
app.use('/products', productsRouter);

export default app;