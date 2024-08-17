import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import { verify } from "hono/jwt";

export const boardRouter = new Hono<{
 Bindings: {
  DATABASE_URL: string,
  JWT_SECRET: string
 },
 Variables: {
  userId: string
 }
}>();

boardRouter.use('/*', async (c, next) => {
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
 console.log('almost done');

 await next();
})

boardRouter.post('/', async (c) => {
 const prisma = new PrismaClient({
  datasourceUrl: c.env.DATABASE_URL,
 }).$extends(withAccelerate());
 try {
  const { name, columns } = await c.req.json();
  console.log(name);

  const userId = c.get('userId');

  const board = await prisma.board.create({
   data: {
    name,
    user: { connect: { id: userId } },
    columns: {
     create: columns.map((col: any) => ({ name: col.name })),
    },
   },
   include: { columns: true },
  })

  return c.json(board.name);
 }
 catch (err) {
  console.log(err);
 }

})

boardRouter.get('/', async (c) => {
 const prisma = new PrismaClient({
  datasourceUrl: c.env.DATABASE_URL,
 }).$extends(withAccelerate());
 const userId = c.get('userId');
 const boards = await prisma.board.findMany({
  where: { userId: userId },
  include: {
   columns: {
    include: {
     tasks: {
      include: {
       subtasks: true, // Include subtasks within each task
      },
     },
    },
   },
  },
 });
 return c.json([boards]);
})

boardRouter.put('/:id', async (c) => {
 const prisma = new PrismaClient({
  datasourceUrl: c.env.DATABASE_URL,
 }).$extends(withAccelerate());

 const id = c.req.param('id');//board Id
 const { name, columns } = await c.req.json();
 const userId = c.get("userId");

 const board = await prisma.board.updateMany({
  where: { id, userId: userId },
  data: { name }
 })

 if (!board.count) {
  return c.json({ error: 'Board not found or not authorized' }, 404);
 }

 const existingColumns = await prisma.column.findMany({
  where: { boardId: id }
 });

 const existingColumnIds = new Set(existingColumns.map(col => col.id));


 for (const column of columns) {
  if (column.id && existingColumnIds.has(column.id)) {

   //updating existing column name
   await prisma.column.update({
    where: { id: column.id },
    data: { name: column.name }
   })
   existingColumnIds.delete(column.id);
  }
  else {
   await prisma.column.create({
    data: { name: column.name, boardId: id },
   });
  }
 }

 if (existingColumnIds.size > 0) {
  await prisma.column.deleteMany({
   where: { id: { in: Array.from(existingColumnIds) } },
  });
 }

 const updatedBoard = await prisma.board.findUnique({
  where: { id },
  include: { columns: true },
 });

 return c.json(updatedBoard);


})

boardRouter.delete('/:id', async (c) => {
 const prisma = new PrismaClient({
  datasourceUrl: c.env.DATABASE_URL,
 }).$extends(withAccelerate());

 try {
  const id = c.req.param('id');
  const userId = c.get('userId');

  // Find the board first to ensure it belongs to the user
  const board = await prisma.board.findFirst({
   where: { id, userId },
   include: { columns: true },
  });

  if (!board) {
   return c.json({ error: 'Board not found or not authorized' }, 404);
  }

  // Use a transaction to delete columns first, then the board
  await prisma.$transaction([
   prisma.column.deleteMany({
    where: { boardId: id },
   }),
   prisma.board.delete({
    where: { id },
   }),
  ]);

  return c.json({ message: 'Board and its columns deleted successfully' });
 } catch (err) {
  console.log(err);
  return c.json({ error: 'Something went wrong' }, 500);
 } finally {
  await prisma.$disconnect();
 }
});

