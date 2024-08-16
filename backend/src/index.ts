import { Hono } from 'hono'
import { userRouter } from './routes/user'
import { cors } from 'hono/cors'
import { boardRouter } from './routes/board';
import { taskRouter } from './routes/tasks';

const app = new Hono<{
  Bindings: {
    DATABASE_URL: string,
    JWT_SECRET: string
  }
}>();

app.use('/*', cors());
app.route('api/v1/user/', userRouter);
app.route('/api/v1/board/', boardRouter);
app.route('/api/v1/board/columns', taskRouter);

export default app;

