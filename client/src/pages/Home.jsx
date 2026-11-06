import { useEffect, useState } from "react";
import { Search, SlidersHorizontal, Sparkles, ArrowRight, ChefHat } from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api";
import { useAuth } from "../context/AuthContext";
import RecipeCard from "../components/RecipeCard";

const categories = ["All", "Breakfast", "Lunch", "Dinner", "Dessert", "Snacks", "Drinks", "Vegetarian"];
export default function Home() {
  const [recipes, setRecipes] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [difficulty, setDifficulty] = useState("All");
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const loadRecipes = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/recipes", { params: { search, category, difficulty } });
      setRecipes(data.recipes);
    } catch { toast.error("Could not load recipes. Is the server running?"); }
    finally { setLoading(false); }
  };
  useEffect(() => { loadRecipes(); }, [search, category, difficulty]);

  const toggle = async (id, action) => {
    if (!user) return toast.error("Log in to save or like recipes.");
    try {
      await api.patch(`/recipes/${id}/${action}`);
      loadRecipes();
      toast.success(action === "like" ? "Like updated" : "Saved recipes updated");
    } catch { toast.error("Something went wrong."); }
  };

  return (
    <>
      <section className="hero">
        <div className="hero-glow hero-glow-one"/><div className="hero-glow hero-glow-two"/>
        <div className="hero-content">
          <span className="hero-kicker"><Sparkles size={15}/> GOOD FOOD. GREAT FINDS.</span>
          <h1>Find your next<br/><em>favorite flavor.</em></h1>
          <p>Discover recipes worth sharing, save the ones you love, and make every meal a little more delicious.</p>
          <div className="hero-search">
            <Search size={20}/>
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search recipes, ingredients..." aria-label="Search recipes"/>
            <button onClick={loadRecipes}>Find recipes <ArrowRight size={17}/></button>
          </div>
          <div className="hero-note"><span/> Fresh inspiration, shared by home cooks.</div>
        </div>
        <div className="hero-side">
          <div className="hero-photo"><img src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=900&q=90" alt="Colorful fresh meal"/></div>
          <div className="floating-note"><ChefHat size={19}/><span><strong>Made to be shared</strong><small>Recipes from real kitchens</small></span></div>
        </div>
      </section>

      <main className="main-content">
        <section className="section-heading">
          <div><span className="section-kicker">THE COMMUNITY TABLE</span><h2>Explore recipes</h2><p>Find something delicious for whatever you're craving.</p></div>
          <Link to="/pantry" className="text-link">Use pantry matcher <ArrowRight size={16}/></Link>
        </section>
        <div className="filter-bar">
          <div className="category-list">{categories.map((item) => <button key={item} onClick={() => setCategory(item)} className={`filter-pill ${category === item ? "selected" : ""}`}>{item}</button>)}</div>
          <label className="difficulty-filter"><SlidersHorizontal size={16}/><select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}><option>All</option><option>Easy</option><option>Medium</option><option>Hard</option></select></label>
        </div>
        {loading ? <div className="empty-state">Loading delicious ideas...</div> : recipes.length ? <div className="recipe-grid">{recipes.map((recipe) => <RecipeCard key={recipe._id} recipe={recipe} onLike={(id) => toggle(id, "like")} onSave={(id) => toggle(id, "save")}/>)}</div> : <div className="empty-state"><ChefHat size={32}/><h3>No recipes found yet</h3><p>Try another search, or be the first to share a recipe.</p>{user && <Link className="button button-orange" to="/recipes/new">Share a recipe</Link>}</div>}
      </main>
    </>
  );
}
