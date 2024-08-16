import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import { verify } from "hono/jwt";

export const taskRouter = new Hono<{
 Bindings: {
  DATABASE_URL: string,
  JWT_SECRET: string
 },
 Variables: {
  userId: string
 }
}>();

taskRouter.use('/*', async (c, next) => {
 const jwt = c.req.header('authorization');
 if (!jwt) {
  c.status(403);
  return c.json({
   error: "unauthorized"
  })
 }

 const token = jwt.split(' ')[1];
 const payload = await verify(token, c.env.JWT_SECRET);
 if (!payload) {
  c.status(401);
  return c.json({
   error: "unauthorized"
  })
 }

 //@ts-ignore
 c.set("userId", payload.id);
 await next();
})

taskRouter.post('/:columnId/task', async (c) => {
 const prisma = new PrismaClient({
  datasourceUrl: c.env.DATABASE_URL,
 }).$extends(withAccelerate());


 const columnId = c.req.param('columnId');
 const { title, description, subtasks } = await c.req.json();
 const userId = c.get('userId');

 // Ensure the column belongs to the user
 const column = await prisma.column.findFirst({
  where: {
   id: columnId,
   board: { userId: userId },
  },
 });

 if (!column) {
  return c.json({ error: 'Column not found or not authorized' }, 404);
 }

 // Create the task with subtasks
 const task = await prisma.task.create({
  data: {
   title,
   description,
   status: column.name,
   column: { connect: { id: columnId } },
   subtasks: {
    create: subtasks.map((subtask: any) => ({
     title: subtask.title,
     isCompleted: subtask.isCompleted || false,
    })),
   },
  },
  include: { subtasks: true },
 });

 return c.json(task);
});

taskRouter.get('/:columnId/tasks', async (c) => {
 const prisma = new PrismaClient({
  datasourceUrl: c.env.DATABASE_URL,
 }).$extends(withAccelerate());

 const columnId = c.req.param('columnId');
 const userId = c.get('userId');

 // Ensure the column belongs to the user
 const column = await prisma.column.findFirst({
  where: {
   id: columnId,
   board: { userId: userId },
  },
 });

 if (!column) {
  return c.json({ error: 'Column not found or not authorized' }, 404);
 }

 const tasks = await prisma.task.findMany({
  where: { columnId },
  include: { subtasks: true },
 });

 return c.json(tasks);

})

taskRouter.put('/tasks/:id', async (c) => {
 const prisma = new PrismaClient({
  datasourceUrl: c.env.DATABASE_URL,
 }).$extends(withAccelerate());


 const id = c.req.param('id');
 const { title, description, status, subtasks } = await c.req.json();
 const userId = c.get('userId');

 // Ensure the task belongs to a column in the user's board
 const task = await prisma.task.findFirst({
  where: {
   id,
   column: {
    board: { userId: userId },
   },
  },
  include: { subtasks: true },
 });

 if (!task) {
  return c.json({ error: 'Task not found or not authorized' }, 404);
 }

 // Update the task
 const updatedTask = await prisma.task.update({
  where: { id },
  data: {
   title,
   description,
   status,
   subtasks: {
    deleteMany: {}, // Delete existing subtasks
    create: subtasks.map((subtask: any) => ({
     title: subtask.title,
     isCompleted: subtask.isCompleted || false,
    })),
   },
  },
  include: { subtasks: true },
 });

 return c.json(updatedTask);
});

taskRouter.delete('/tasks/:id', async (c) => {
 const prisma = new PrismaClient({
  datasourceUrl: c.env.DATABASE_URL,
 }).$extends(withAccelerate());

 const id = c.req.param('id');
 const userId = c.get('userId');

 // Ensure the task belongs to a column in the user's board
 const task = await prisma.task.findFirst({
  where: {
   id,
   column: {
    board: { userId: userId },
   },
  },
 });

 if (!task) {
  return c.json({ error: 'Task not found or not authorized' }, 404);
 }

 // Delete the task (and cascades to delete subtasks)
 await prisma.task.delete({
  where: { id },
 });

 return c.json({ message: 'Task deleted successfully' });
});