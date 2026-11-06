import { Router } from "express";
import mongoose from "mongoose";
import Recipe from "../models/Recipe.js";
import User from "../models/User.js";
import requireAuth from "../middleware/requireAuth.js";

const router = Router();

const populateRecipe = (query) => query.populate("author", "name").sort({ createdAt: -1 });

function validateRecipe(body) {
  const required = ["title", "description"];
  if (required.some((key) => !body[key]?.trim())) return "Title and description are required.";
  if (!Array.isArray(body.ingredients) || body.ingredients.length === 0) return "Add at least one ingredient.";
  if (!Array.isArray(body.instructions) || body.instructions.length === 0) return "Add at least one instruction.";
  return null;
}

router.get("/", async (req, res, next) => {
  try {
    const { search, category, difficulty } = req.query;
    const filter = {};
    if (category && category !== "All") filter.category = category;
    if (difficulty && difficulty !== "All") filter.difficulty = difficulty;
    if (search?.trim()) {
      const safe = search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      filter.$or = [
        { title: { $regex: safe, $options: "i" } },
        { description: { $regex: safe, $options: "i" } },
        { ingredients: { $regex: safe, $options: "i" } },
        { tags: { $regex: safe, $options: "i" } }
      ];
    }
    const recipes = await populateRecipe(Recipe.find(filter));
    res.json({ recipes });
  } catch (error) { next(error); }
});

router.get("/user/mine", requireAuth, async (req, res, next) => {
  try {
    const recipes = await populateRecipe(Recipe.find({ author: req.user._id }));
    res.json({ recipes });
  } catch (error) { next(error); }
});

router.get("/user/saved", requireAuth, async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: "savedRecipes", populate: { path: "author", select: "name" }
    });
    res.json({ recipes: user.savedRecipes });
  } catch (error) { next(error); }
});

router.get("/:id", async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: "Invalid recipe id." });
    const recipe = await Recipe.findById(req.params.id).populate("author", "name");
    if (!recipe) return res.status(404).json({ message: "Recipe not found." });
    res.json({ recipe });
  } catch (error) { next(error); }
});

router.post("/", requireAuth, async (req, res, next) => {
  try {
    const problem = validateRecipe(req.body);
    if (problem) return res.status(400).json({ message: problem });
    const recipe = await Recipe.create({ ...req.body, author: req.user._id });
    await recipe.populate("author", "name");
    res.status(201).json({ recipe });
  } catch (error) { next(error); }
});

router.put("/:id", requireAuth, async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: "Invalid recipe id." });
    const problem = validateRecipe(req.body);
    if (problem) return res.status(400).json({ message: problem });
    const recipe = await Recipe.findOneAndUpdate(
      { _id: req.params.id, author: req.user._id },
      { ...req.body, author: req.user._id },
      { new: true, runValidators: true }
    ).populate("author", "name");
    if (!recipe) return res.status(404).json({ message: "Recipe not found or you are not allowed to edit it." });
    res.json({ recipe });
  } catch (error) { next(error); }
});

router.delete("/:id", requireAuth, async (req, res, next) => {
  try {
    const recipe = await Recipe.findOneAndDelete({ _id: req.params.id, author: req.user._id });
    if (!recipe) return res.status(404).json({ message: "Recipe not found or you are not allowed to delete it." });
    await User.updateMany({}, { $pull: { savedRecipes: recipe._id } });
    res.json({ message: "Recipe deleted." });
  } catch (error) { next(error); }
});

router.patch("/:id/like", requireAuth, async (req, res, next) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: "Recipe not found." });
    const alreadyLiked = recipe.likes.some((id) => id.equals(req.user._id));
    if (alreadyLiked) recipe.likes.pull(req.user._id);
    else recipe.likes.push(req.user._id);
    await recipe.save();
    res.json({ liked: !alreadyLiked, likesCount: recipe.likes.length });
  } catch (error) { next(error); }
});

router.patch("/:id/save", requireAuth, async (req, res, next) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: "Recipe not found." });
    const user = await User.findById(req.user._id);
    const alreadySaved = user.savedRecipes.some((id) => id.equals(recipe._id));
    if (alreadySaved) user.savedRecipes.pull(recipe._id);
    else user.savedRecipes.push(recipe._id);
    await user.save();
    res.json({ saved: !alreadySaved });
  } catch (error) { next(error); }
});

export default router;
