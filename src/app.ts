import express, { Express, Request, Response } from 'express';
import { MainRouter } from './routes';
import dotenv from 'dotenv';

dotenv.config();

const app: Express = express();
const port = process.env.PORT  || "3000"

// app.get('/', (req: Request, res: Response) => {
//   res.send('Express + TypeScript Server');
// });


app.use('/api', MainRouter);


// app.get('/about', (req: Request, res: Response) => {
//   res.send('test');
// });


// app.listen(port, () => {
//   console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
// }); 

export default app;