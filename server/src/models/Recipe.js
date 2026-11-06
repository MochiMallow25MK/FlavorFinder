import mongoose from "mongoose";

const recipeSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 100 },
  description: { type: String, required: true, trim: true, maxlength: 600 },
  imageUrl: { type: String, default: "" },
  videoUrl: { type: String, default: "" },
  category: { type: String, default: "Other" },
  difficulty: { type: String, enum: ["Easy", "Medium", "Hard"], default: "Easy" },
  prepTime: { type: Number, min: 0, default: 0 },
  cookTime: { type: Number, min: 0, default: 0 },
  servings: { type: Number, min: 1, default: 2 },
  ingredients: [{ type: String, trim: true }],
  instructions: [{ type: String, trim: true }],
  tags: [{ type: String, trim: true }],
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
}, { timestamps: true });

recipeSchema.index({ title: "text", description: "text", ingredients: "text", tags: "text" });

export default mongoose.model("Recipe", recipeSchema);
