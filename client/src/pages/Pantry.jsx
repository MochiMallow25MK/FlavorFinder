import { useEffect, useMemo, useState } from "react";
import { Search, Leaf, X, Plus, Sparkles } from "lucide-react";
import toast from "react-hot-toast";
import api from "../api";
import RecipeCard from "../components/RecipeCard";

export default function Pantry() {
  const [text, setText] = useState("");
  const [items, setItems] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [searched, setSearched] = useState(false);
  useEffect(() => { api.get("/recipes").then(({ data }) => setRecipes(data.recipes)).catch(() => {}); }, []);
  const add = (e) => {
    e.preventDefault();
    const ingredient = text.trim().toLowerCase();
    if (!ingredient) return;
    if (items.includes(ingredient)) return toast.error("That ingredient is already in your pantry.");
    setItems([...items, ingredient]); setText("");
  };
  const matches = useMemo(() => recipes.map(recipe => {
    const ingredients = (recipe.ingredients || []).map(x => x.toLowerCase());
    const matched = items.filter(item => ingredients.some(ingredient => ingredient.includes(item) || item.includes(ingredient)));
    return { ...recipe, matched, matchCount: matched.length, percentage: ingredients.length ? Math.round(matched.length / ingredients.length * 100) : 0 };
  }).filter(recipe => recipe.matchCount > 0).sort((a,b) => b.matchCount - a.matchCount), [recipes, items]);
  return <main className="pantry-page"><div className="pantry-intro"><span className="section-kicker"><Leaf size={15}/> SMART INGREDIENT MATCHER</span><h1>What's in your <em>kitchen?</em></h1><p>Add the ingredients you already have. We'll find recipes you can make right now.</p>
    <form className="pantry-input" onSubmit={add}><Search size={19}/><input value={text} onChange={e => setText(e.target.value)} placeholder="Add an ingredient, e.g. tomato" aria-label="Add pantry ingredient"/><button className="button button-orange"><Plus size={17}/> Add</button></form>
    <div className="pantry-chips">{items.length ? items.map(item => <button key={item} className="pantry-chip" onClick={() => setItems(items.filter(x => x !== item))}>{item}<X size={14}/></button>) : <span className="pantry-hint">Your ingredients will appear here. Select the X to remove one.</span>}</div>
    <button className="button button-green match-button" onClick={() => setSearched(true)} disabled={!items.length}><Sparkles size={17}/> Find matching recipes</button>
  </div>
  <section className="pantry-results"><div className="section-heading"><div><span className="section-kicker">MADE WITH WHAT YOU HAVE</span><h2>{searched ? `${matches.length} recipe matches` : "Your recipe matches"}</h2><p>Recipes are ranked by how many of your ingredients they use.</p></div></div>
    {searched && matches.length ? <div className="recipe-grid">{matches.map(recipe => <div className="match-card-wrap" key={recipe._id}><div className="match-badge">{recipe.matchCount} ingredient{recipe.matchCount !== 1 ? "s" : ""} match · {recipe.percentage}%</div><RecipeCard recipe={recipe}/><p className="matched-list">Matched: {recipe.matched.join(", ")}</p></div>)}</div> : <div className="empty-state"><Leaf size={32}/><h3>{searched ? "No matches yet" : "Your next meal starts here"}</h3><p>{searched ? "Try adding more ingredients or browsing all recipes." : "Add a few ingredients above, then find recipes that use them."}</p></div>}
  </section></main>;
}
