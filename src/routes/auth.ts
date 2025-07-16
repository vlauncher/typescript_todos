import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { body, param } from 'express-validator';
import { validate } from '../middleware/validate';

const router = Router();

router.post(
  '/register',
  validate([
    body('first_name').isString().isLength({ min: 2, max: 50 }),
    body('last_name').isString().isLength({ min: 2, max: 50 }),
    body('email').isEmail(),
    body('password').isLength({ min: 8 }).matches(/[A-Z]/).matches(/[a-z]/).matches(/[0-9]/),
  ]),
  AuthController.register
);

router.post(
  '/login',
  validate([
    body('email').isEmail(),
    body('password').isString().notEmpty(),
  ]),
  AuthController.login
);

router.get(
  '/verify/:token',
  validate([
    param('token').isString().notEmpty(),
  ]),
  AuthController.verifyEmail
);

router.post(
  '/forgot-password',
  validate([
    body('email').isEmail(),
  ]),
  AuthController.forgotPassword
);

router.post(
  '/reset-password/:token',
  validate([
    param('token').isString().notEmpty(),
    body('password').isLength({ min: 8 }).matches(/[A-Z]/).matches(/[a-z]/).matches(/[0-9]/),
  ]),
  AuthController.resetPassword
);

router.post('/logout', AuthController.logout);
router.post('/refresh', AuthController.refreshToken);

export default router; 