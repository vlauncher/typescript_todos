import { Router } from 'express';
import { TodoController } from '../controllers/todoController';
import { auth } from '../middleware/auth';
import { body, param } from 'express-validator';
import { validate } from '../middleware/validate';

const router = Router();

router.get('/', auth, TodoController.getTodos);

router.post(
  '/',
  auth,
  validate([
    body('title').isString().isLength({ min: 1, max: 100 }),
  ]),
  TodoController.createTodo
);

router.put(
  '/:id',
  auth,
  validate([
    param('id').isMongoId(),
    body('title').optional().isString().isLength({ min: 1, max: 100 }),
    body('completed').optional().isBoolean(),
  ]),
  TodoController.updateTodo
);

router.delete(
  '/:id',
  auth,
  validate([
    param('id').isMongoId(),
  ]),
  TodoController.deleteTodo
);

router.patch(
  '/:id/toggleArchived',
  auth,
  validate([
    param('id').isMongoId(),
  ]),
  TodoController.toggleArchived
);

router.patch(
  '/:id/toggleCompleted',
  auth,
  validate([
    param('id').isMongoId(),
  ]),
  TodoController.toggleCompleted
);

export default router; 