"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTodo = exports.updateTodo = exports.createTodo = exports.getTodos = void 0;
const Todo_1 = __importDefault(require("../models/Todo"));
const getTodos = async (req, res) => {
    try {
        const todos = await Todo_1.default.find({ user: req.user });
        res.json(todos);
    }
    catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getTodos = getTodos;
const createTodo = async (req, res) => {
    const { title } = req.body;
    try {
        const todo = await Todo_1.default.create({ title, user: req.user });
        res.status(201).json(todo);
    }
    catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.createTodo = createTodo;
const updateTodo = async (req, res) => {
    const { id } = req.params;
    const { title, completed } = req.body;
    try {
        const todo = await Todo_1.default.findOneAndUpdate({ _id: id, user: req.user }, { title, completed }, { new: true });
        if (!todo) {
            return res.status(404).json({ message: 'Todo not found' });
        }
        res.json(todo);
    }
    catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.updateTodo = updateTodo;
const deleteTodo = async (req, res) => {
    const { id } = req.params;
    try {
        const todo = await Todo_1.default.findOneAndDelete({ _id: id, user: req.user });
        if (!todo) {
            return res.status(404).json({ message: 'Todo not found' });
        }
        res.json({ message: 'Todo deleted' });
    }
    catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.deleteTodo = deleteTodo;
