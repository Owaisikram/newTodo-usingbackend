import { Schema, model } from "mongoose";

const todoSchema = new Schema(
  {
    todoContent: { type: String, required: true },
    ip: { type: String },
  },
  { timestamps: true }
);

export const Todo = model("Todo", todoSchema);
