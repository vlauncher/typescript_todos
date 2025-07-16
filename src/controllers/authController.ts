import { Request, Response } from 'express';
import { AuthService } from '../services/authService';

export class AuthController {
  static async register(req: Request, res: Response) {
    return AuthService.register(req, res);
  }

  static async verifyEmail(req: Request, res: Response) {
    return AuthService.verifyEmail(req, res);
  }

  static async login(req: Request, res: Response) {
    return AuthService.login(req, res);
  }

  static async forgotPassword(req: Request, res: Response) {
    return AuthService.forgotPassword(req, res);
  }

  static async resetPassword(req: Request, res: Response) {
    return AuthService.resetPassword(req, res);
  }
} 