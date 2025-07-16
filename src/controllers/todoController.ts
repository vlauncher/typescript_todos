import { Request, Response } from 'express';
import { TodoService } from '../services/todoService';

export class TodoController {
  static async getTodos(req: Request, res: Response) {
    return TodoService.getTodos(req, res);
  }

  static async createTodo(req: Request, res: Response) {
    return TodoService.createTodo(req, res);
  }

  static async updateTodo(req: Request, res: Response) {
    return TodoService.updateTodo(req, res);
  }

  static async deleteTodo(req: Request, res: Response) {
    return TodoService.deleteTodo(req, res);
  }

  static async toggleArchived(req: Request, res: Response) {
    return TodoService.toggleArchived(req, res);
  }

  static async toggleCompleted(req: Request, res: Response) {
    return TodoService.toggleCompleted(req, res);
  }
}
