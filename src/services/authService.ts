import { Request, Response } from 'express';
import User from '../models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { sendMail } from '../utils/mailer';
import { config } from '../utils/config';

export class AuthService {

  static async register(req: Request, res: Response) {
    const { first_name, last_name, email, password } = req.body;
    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({ first_name, last_name, email, password: hashedPassword, is_verified: false });
      await user.save();
      // Create verification token
      const token = jwt.sign({ userId: user._id }, config.jwtSecret, { expiresIn: '1d' });
      const verifyUrl = `${config.clientUrl}/api/auth/verify/${token}`;
      try {
        await sendMail(
          user.email,
          'Verify your email',
          `<p>Hello ${user.first_name},</p><p>Please verify your email by clicking <a href="${verifyUrl}">here</a>.</p>`
        );
      } catch (mailErr) {
        console.error('Error sending verification email:', mailErr);
        return res.status(500).json({ message: 'Failed to send verification email. Please try again later.' });
      }
      res.status(201).json({ message: 'Registration successful. Please check your email to verify your account.' });
    } catch (err) {
      console.error('Registration error:', err);
      res.status(500).json({ message: 'Server error' });
    }
  }

  static async verifyEmail(req: Request, res: Response) {
    const { token } = req.params;
    try {
      const decoded = jwt.verify(token, config.jwtSecret) as { userId: string };
      const user = await User.findById(decoded.userId);
      if (!user) return res.status(400).send('Invalid link');
      if (user.is_verified) return res.send('Email already verified');
      user.is_verified = true;
      await user.save();
      res.send('Email verification successful! You can now log in.');
    } catch (err) {
      res.status(400).send('Invalid or expired link');
    }
  }

  static async login(req: Request, res: Response) {
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
      const accessToken = jwt.sign({ userId: user._id }, config.jwtSecret, { expiresIn: '15m' });
      const refreshToken = jwt.sign({ userId: user._id }, config.jwtSecret, { expiresIn: '7d' });
      res.json({ access: accessToken, refresh: refreshToken });
    } catch (err) {
      res.status(500).json({ message: 'Server error' });
    }
  }

  static async forgotPassword(req: Request, res: Response) {
    const { email } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ message: 'User not found' });
      const token = jwt.sign({ userId: user._id }, config.jwtSecret, { expiresIn: '1h' });
      const resetUrl = `${config.clientUrl}/api/auth/reset-password/${token}`;
      try {
        await sendMail(
          user.email,
          'Reset your password',
          `<p>Hello ${user.first_name},</p><p>Reset your password by clicking <a href="${resetUrl}">here</a>.</p>`
        );
      } catch (mailErr) {
        console.error('Error sending password reset email:', mailErr);
        return res.status(500).json({ message: 'Failed to send password reset email. Please try again later.' });
      }
      res.json({ message: 'Password reset link sent to your email.' });
    } catch (err) {
      console.error('Forgot password error:', err);
      res.status(500).json({ message: 'Server error' });
    }
  }

  static async resetPassword(req: Request, res: Response) {
    const { token } = req.params;
    const { password } = req.body;
    try {
      const decoded = jwt.verify(token, config.jwtSecret) as { userId: string };
      const user = await User.findById(decoded.userId);
      if (!user) return res.status(400).send('Invalid link');
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
      await user.save();
      await sendMail(
        user.email,
        'Password Reset Successful',
        `<p>Hello ${user.first_name},</p><p>Your password has been reset successfully.</p>`
      );
      res.send('Password reset successful! You can now log in.');
    } catch (err) {
      res.status(400).send('Invalid or expired link');
    }
  }
} 