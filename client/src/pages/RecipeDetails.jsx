import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Clock3, Users, Heart, Bookmark, Pencil, Trash2, ArrowLeft, PlayCircle } from "lucide-react";
import toast from "react-hot-toast";
import api from "../api";
import { useAuth } from "../context/AuthContext";

const fallback = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=1200&q=85";
export default function RecipeDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [saved, setSaved] = useState(false);
  const [liked, setLiked] = useState(false);

  const load = async () => {
    try {
      const { data } = await api.get(`/recipes/${id}`);
      setRecipe(data.recipe);
      setLiked(data.recipe.likes?.includes(user?.id) || data.recipe.likes?.includes(user?._id) || false);
    } catch { toast.error("Recipe not found."); navigate("/"); }
  };
  useEffect(() => { load(); }, [id, user]);
  if (!recipe) return <div className="page-loader">Loading recipe...</div>;
  const isOwner = user && (recipe.author?._id === user.id || recipe.author?._id === user._id);

  const toggle = async (action) => {
    if (!user) return toast.error("Log in to like or save recipes.");
    try {
      const { data } = await api.patch(`/recipes/${id}/${action}`);
      if (action === "like") setLiked(data.liked);
      else setSaved(data.saved);
    } catch { toast.error("Could not update recipe."); }
  };
  const remove = async () => {
    if (!window.confirm("Delete this recipe permanently?")) return;
    try { await api.delete(`/recipes/${id}`); toast.success("Recipe deleted."); navigate("/my-recipes"); }
    catch { toast.error("Could not delete recipe."); }
  };

  return <main className="detail-page">
    <Link to="/" className="back-link"><ArrowLeft size={16}/> Back to discover</Link>
    <div className="detail-hero"><img src={recipe.imageUrl || fallback} alt={recipe.title} onError={e => { e.currentTarget.src = fallback; }}/><div className="detail-overlay"><span className="category-tag">{recipe.category}</span><h1>{recipe.title}</h1><p>{recipe.description}</p><span className="detail-author">Shared by {recipe.author?.name || "Community chef"}</span></div></div>
    <div className="detail-toolbar"><div className="detail-stats"><span><Clock3 size={17}/>{(recipe.prepTime || 0) + (recipe.cookTime || 0)} min total</span><span><Users size={17}/>{recipe.servings} servings</span><span>{recipe.difficulty} difficulty</span></div><div className="detail-actions"><button className={`button button-outline ${liked ? "liked" : ""}`} onClick={() => toggle("like")}><Heart size={17} fill={liked ? "currentColor" : "none"}/> Like</button><button className={`button button-outline ${saved ? "saved" : ""}`} onClick={() => toggle("save")}><Bookmark size={17} fill={saved ? "currentColor" : "none"}/> Save</button>{isOwner && <><Link className="button button-outline" to={`/recipes/${id}/edit`}><Pencil size={16}/> Edit</Link><button className="icon-button delete-button" onClick={remove} aria-label="Delete recipe"><Trash2 size={18}/></button></>}</div></div>
    <div className="detail-content"><section className="ingredients-panel"><span className="section-kicker">WHAT YOU'LL NEED</span><h2>Ingredients</h2><ul className="ingredient-list">{recipe.ingredients.map((item, i) => <li key={i}><span className="ingredient-check"/>{item}</li>)}</ul></section><section className="instructions-panel"><span className="section-kicker">LET'S GET COOKING</span><h2>Instructions</h2><ol className="instruction-list">{recipe.instructions.map((item, i) => <li key={i}><span>{String(i+1).padStart(2,"0")}</span><p>{item}</p></li>)}</ol>{recipe.videoUrl && <a className="video-link" href={recipe.videoUrl} target="_blank" rel="noreferrer"><PlayCircle size={19}/> Watch recipe video</a>}</section></div>
  </main>;
}
