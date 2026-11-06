import { useEffect, useState } from "react";
import { Bookmark, BookOpen, ChefHat } from "lucide-react";
import toast from "react-hot-toast";
import api from "../api";
import RecipeCard from "../components/RecipeCard";

export default function RecipeLists({ saved = false }) {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const load = () => api.get(saved ? "/recipes/user/saved" : "/recipes/user/mine")
    .then(({ data }) => setRecipes(data.recipes || []))
    .catch(() => toast.error("Could not load your recipes."))
    .finally(() => setLoading(false));
  useEffect(() => { load(); }, [saved]);
  return <main className="main-content list-page"><section className="section-heading"><div><span className="section-kicker">YOUR PERSONAL COLLECTION</span><h2>{saved ? "Saved recipes" : "My recipes"}</h2><p>{saved ? "All the delicious ideas you've bookmarked." : "Recipes you've shared with the community."}</p></div>{saved ? <Bookmark size={30}/> : <BookOpen size={30}/>}</section>
    {loading ? <div className="empty-state">Loading...</div> : recipes.length ? <div className="recipe-grid">{recipes.map(recipe => <RecipeCard key={recipe._id} recipe={recipe}/>)}</div> : <div className="empty-state"><ChefHat size={32}/><h3>{saved ? "No saved recipes yet" : "Your recipe book is empty"}</h3><p>{saved ? "Save recipes you love and they'll show up here." : "Share your first recipe with the community."}</p></div>}
  </main>;
}
