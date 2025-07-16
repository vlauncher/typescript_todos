"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.forgotPassword = exports.login = exports.verifyEmail = exports.register = void 0;
const User_1 = __importDefault(require("../models/User"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const mailer_1 = require("../utils/mailer");
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5000';
const register = async (req, res) => {
    const { first_name, last_name, email, password } = req.body;
    try {
        const existingUser = await User_1.default.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const user = new User_1.default({ first_name, last_name, email, password: hashedPassword, is_verified: false });
        await user.save();
        // Create verification token
        const token = jsonwebtoken_1.default.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        const verifyUrl = `${CLIENT_URL}/api/auth/verify/${token}`;
        try {
            await (0, mailer_1.sendMail)(user.email, 'Verify your email', `<p>Hello ${user.first_name},</p><p>Please verify your email by clicking <a href="${verifyUrl}">here</a>.</p>`);
        }
        catch (mailErr) {
            console.error('Error sending verification email:', mailErr);
            return res.status(500).json({ message: 'Failed to send verification email. Please try again later.' });
        }
        res.status(201).json({ message: 'Registration successful. Please check your email to verify your account.' });
    }
    catch (err) {
        console.error('Registration error:', err);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.register = register;
const verifyEmail = async (req, res) => {
    const { token } = req.params;
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const user = await User_1.default.findById(decoded.userId);
        if (!user)
            return res.status(400).send('Invalid link');
        if (user.is_verified)
            return res.send('Email already verified');
        user.is_verified = true;
        await user.save();
        res.send('Email verification successful! You can now log in.');
    }
    catch (err) {
        res.status(400).send('Invalid or expired link');
    }
};
exports.verifyEmail = verifyEmail;
const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User_1.default.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const isMatch = await bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const token = jsonwebtoken_1.default.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.json({ token });
    }
    catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.login = login;
const forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User_1.default.findOne({ email });
        if (!user)
            return res.status(400).json({ message: 'User not found' });
        const token = jsonwebtoken_1.default.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        const resetUrl = `${CLIENT_URL}/api/auth/reset-password/${token}`;
        try {
            await (0, mailer_1.sendMail)(user.email, 'Reset your password', `<p>Hello ${user.first_name},</p><p>Reset your password by clicking <a href="${resetUrl}">here</a>.</p>`);
        }
        catch (mailErr) {
            console.error('Error sending password reset email:', mailErr);
            return res.status(500).json({ message: 'Failed to send password reset email. Please try again later.' });
        }
        res.json({ message: 'Password reset link sent to your email.' });
    }
    catch (err) {
        console.error('Forgot password error:', err);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.forgotPassword = forgotPassword;
const resetPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const user = await User_1.default.findById(decoded.userId);
        if (!user)
            return res.status(400).send('Invalid link');
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        user.password = hashedPassword;
        await user.save();
        await (0, mailer_1.sendMail)(user.email, 'Password Reset Successful', `<p>Hello ${user.first_name},</p><p>Your password has been reset successfully.</p>`);
        res.send('Password reset successful! You can now log in.');
    }
    catch (err) {
        res.status(400).send('Invalid or expired link');
    }
};
exports.resetPassword = resetPassword;
