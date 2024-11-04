import express, { Express, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import cors from 'cors';

const app: Express = express();

const prisma = new PrismaClient();

const port = 9000;

app.use(cors());

// JSON形式
app.use(express.json());

// 全てのタスクを取得

app.get('/allTasks', async (_req: Request, res: Response): Promise<any> => {
  try {
    const allTasks = await prisma.todo.findMany();
    console.log(allTasks);
    return res.status(200).json(allTasks);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: 'サーバーエラーです。' });
  }
});

//タスクを追加 作成

app.post('/createTask', async (req: Request, res: Response): Promise<any> => {
  try {
    const { title, isCompleted } = req.body;
    const newTask = await prisma.todo.create({
      data: {
        title,
        isCompleted,
      },
    });
    return res.status(200).json(newTask);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'サーバーエラーです。' });
  }
});

// タスクを編集

app.put('/editTask/:id', async (req: Request, res: Response): Promise<any> => {
  try {
    const { title, isCompleted } = req.body;
    const id = Number(req.params.id);
    const updateTask = await prisma.todo.update({
      where: {
        id,
      },
      data: {
        title,
        isCompleted,
      },
    });
    return res.status(200).json(updateTask);
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json({ message: 'リクエストが不正です。サーバーエラー' });
  }
});

// タスクを削除

app.delete(
  '/deleteTask/:id',
  async (req: Request, res: Response): Promise<any> => {
    try {
      const id = Number(req.params.id);
      const deleteTask = await prisma.todo.delete({
        where: {
          id,
        },
      });
      return res.status(200).json(deleteTask);
    } catch (error) {
      console.log(error);
      return res
        .status(400)
        .json({ message: 'リクエストが不正です。サーバーエラー' });
    }
  }
);

app.listen(port, () => {
  console.log(`server running on port ${port}`);
});
