import mongoose, { Document, Schema, Types } from 'mongoose';

export interface ITodo extends Document {
  title: string;
  description?: string;
  completed: boolean;
  archived: boolean;
  priority: 'low' | 'medium' | 'high';
  user: Types.ObjectId;
}

const TodoSchema = new Schema<ITodo>({
  title: { type: String, required: true },
  description: { type: String },
  completed: { type: Boolean, default: false },
  archived: { type: Boolean, default: false },
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'low' },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

const Todo = mongoose.model<ITodo>('Todo', TodoSchema);
export default Todo;
