import { Request, Response } from 'express';
import Todo from '../models/Todo';

interface AuthRequest extends Request {
  user?: string;
}

export class TodoService {
  static async getTodos(req: AuthRequest, res: Response) {
    try {
      const todos = await Todo.find({ user: req.user });
      res.json(todos);
    } catch (err) {
      res.status(500).json({ message: 'Server error' });
    }
  }

  static async createTodo(req: AuthRequest, res: Response) {
    const { title } = req.body;
    try {
      const todo = await Todo.create({ title, user: req.user });
      res.status(201).json(todo);
    } catch (err) {
      res.status(500).json({ message: 'Server error' });
    }
  }

  static async updateTodo(req: AuthRequest, res: Response) {
    const { id } = req.params;
    const { title, completed } = req.body;
    try {
      const todo = await Todo.findOneAndUpdate(
        { _id: id, user: req.user },
        { title, completed },
        { new: true }
      );
      if (!todo) {
        return res.status(404).json({ message: 'Todo not found' });
      }
      res.json(todo);
    } catch (err) {
      res.status(500).json({ message: 'Server error' });
    }
  }

  static async deleteTodo(req: AuthRequest, res: Response) {
    const { id } = req.params;
    try {
      const todo = await Todo.findOneAndDelete({ _id: id, user: req.user });
      if (!todo) {
        return res.status(404).json({ message: 'Todo not found' });
      }
      res.json({ message: 'Todo deleted' });
    } catch (err) {
      res.status(500).json({ message: 'Server error' });
    }
  }

  static async toggleArchived(req: AuthRequest, res: Response) {
    const { id } = req.params;
    try {
      const todo = await Todo.findOne({ _id: id, user: req.user });
      if (!todo) {
        return res.status(404).json({ message: 'Todo not found' });
      }
      todo.archived = !todo.archived;
      await todo.save();
      res.json(todo);
    } catch (err) {
      res.status(500).json({ message: 'Server error' });
    }
  }

  static async toggleCompleted(req: AuthRequest, res: Response) {
    const { id } = req.params;
    try {
      const todo = await Todo.findOne({ _id: id, user: req.user });
      if (!todo) {
        return res.status(404).json({ message: 'Todo not found' });
      }
      todo.completed = !todo.completed;
      await todo.save();
      res.json(todo);
    } catch (err) {
      res.status(500).json({ message: 'Server error' });
    }
  }
}
