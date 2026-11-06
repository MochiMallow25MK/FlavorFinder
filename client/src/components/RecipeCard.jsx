import { Link } from "react-router-dom";
import { Clock3, Heart, Bookmark, Users, Star } from "lucide-react";

const fallback = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=900&q=85";
export default function RecipeCard({ recipe, onLike, onSave, liked = false, saved = false }) {
  return (
    <article className="recipe-card">
      <Link to={`/recipes/${recipe._id}`} className="card-image-wrap">
        <img className="card-image" src={recipe.imageUrl || fallback} alt={recipe.title} onError={(e) => { e.currentTarget.src = fallback; }} />
        <span className="category-tag">{recipe.category || "Recipe"}</span>
      </Link>
      <div className="card-body">
        <div className="card-topline"><span className="eyebrow">{recipe.difficulty || "Easy"}</span><span className="rating"><Star size={14} fill="currentColor"/> New</span></div>
        <Link to={`/recipes/${recipe._id}`} className="card-title">{recipe.title}</Link>
        <p className="card-description">{recipe.description}</p>
        <div className="card-meta">
          <span><Clock3 size={15}/>{(Number(recipe.prepTime) || 0) + (Number(recipe.cookTime) || 0)} min</span>
          <span><Users size={15}/>{recipe.servings || 2} servings</span>
        </div>
        <div className="card-footer">
          <span className="author-name">By {recipe.author?.name || "Community chef"}</span>
          <div className="card-controls">
            {onLike && <button className={`mini-action like-action ${liked ? "active-like" : ""}`} onClick={() => onLike(recipe._id)} aria-label="Like recipe"><Heart size={17} fill={liked ? "currentColor" : "none"}/></button>}
            {onSave && <button className={`mini-action save-action ${saved ? "active-save" : ""}`} onClick={() => onSave(recipe._id)} aria-label="Save recipe"><Bookmark size={17} fill={saved ? "currentColor" : "none"}/></button>}
          </div>
        </div>
      </div>
    </article>
  );
}
