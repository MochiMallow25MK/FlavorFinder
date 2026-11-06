import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Plus, X, Image, Video, Clock3, ChefHat } from "lucide-react";
import toast from "react-hot-toast";
import api from "../api";

const blank = { title: "", description: "", imageUrl: "", videoUrl: "", category: "Dinner", difficulty: "Easy", prepTime: 10, cookTime: 20, servings: 2, ingredients: [""], instructions: [""] };
export default function RecipeForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(blank);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (id) api.get(`/recipes/${id}`).then(({ data }) => {
      const recipe = data.recipe;
      setForm({
        ...blank,
        title: recipe.title || "",
        description: recipe.description || "",
        imageUrl: recipe.imageUrl || "",
        videoUrl: recipe.videoUrl || "",
        category: recipe.category || "Dinner",
        difficulty: recipe.difficulty || "Easy",
        prepTime: recipe.prepTime ?? 10,
        cookTime: recipe.cookTime ?? 20,
        servings: recipe.servings ?? 2,
        ingredients: recipe.ingredients?.length ? recipe.ingredients : [""],
        instructions: recipe.instructions?.length ? recipe.instructions : [""]
      });
    }).catch(() => toast.error("Recipe could not be loaded."));
  }, [id]);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const changeList = (key, index, value) => setForm({ ...form, [key]: form[key].map((item, i) => i === index ? value : item) });
  const addList = (key) => setForm({ ...form, [key]: [...form[key], ""] });
  const removeList = (key, index) => setForm({ ...form, [key]: form[key].filter((_, i) => i !== index) });

  const submit = async (e) => {
    e.preventDefault();
    const payload = { ...form, prepTime: Number(form.prepTime), cookTime: Number(form.cookTime), servings: Number(form.servings), ingredients: form.ingredients.map(x => x.trim()).filter(Boolean), instructions: form.instructions.map(x => x.trim()).filter(Boolean) };
    if (!payload.ingredients.length || !payload.instructions.length) return toast.error("Add at least one ingredient and instruction.");
    setBusy(true);
    try {
      const { data } = id ? await api.put(`/recipes/${id}`, payload) : await api.post("/recipes", payload);
      toast.success(id ? "Recipe updated!" : "Recipe shared with the community!");
      navigate(`/recipes/${data.recipe._id}`);
    } catch (error) { toast.error(error.response?.data?.message || "Could not save recipe."); }
    finally { setBusy(false); }
  };

  return <main className="form-page"><div className="form-heading"><span className="section-kicker">YOUR RECIPE, YOUR STORY</span><h1>{id ? "Edit your recipe" : "Share something delicious"}</h1><p>Pass a good thing along. Add the details so someone else can make it too.</p></div>
    <form className="recipe-form" onSubmit={submit}>
      <section className="form-section"><h3><ChefHat size={19}/> The basics</h3>
        <label className="field-label">Recipe title<input className="plain-input" name="title" value={form.title} onChange={change} placeholder="e.g. Creamy lemon pasta" required maxLength="100"/></label>
        <label className="field-label">Short description<textarea className="plain-input" name="description" value={form.description} onChange={change} placeholder="What makes this recipe special?" required rows="3" maxLength="600"/></label>
        <div className="two-fields"><label className="field-label">Category<select className="plain-input" name="category" value={form.category} onChange={change}>{["Breakfast","Lunch","Dinner","Dessert","Snacks","Drinks","Vegetarian","Other"].map(x=><option key={x}>{x}</option>)}</select></label><label className="field-label">Difficulty<select className="plain-input" name="difficulty" value={form.difficulty} onChange={change}>{["Easy","Medium","Hard"].map(x=><option key={x}>{x}</option>)}</select></label></div>
        <label className="field-label"><Image size={15}/> Cover image URL<input className="plain-input" type="url" name="imageUrl" value={form.imageUrl} onChange={change} placeholder="https://example.com/your-food-photo.jpg"/></label>
        <label className="field-label"><Video size={15}/> Optional video URL<input className="plain-input" type="url" name="videoUrl" value={form.videoUrl} onChange={change} placeholder="YouTube or recipe video link"/></label>
        <div className="three-fields"><label className="field-label"><Clock3 size={15}/> Prep (min)<input className="plain-input" type="number" min="0" name="prepTime" value={form.prepTime} onChange={change}/></label><label className="field-label">Cook (min)<input className="plain-input" type="number" min="0" name="cookTime" value={form.cookTime} onChange={change}/></label><label className="field-label">Servings<input className="plain-input" type="number" min="1" name="servings" value={form.servings} onChange={change}/></label></div>
      </section>
      <section className="form-section"><div className="section-title-row"><h3>Ingredients</h3><button type="button" className="add-line" onClick={() => addList("ingredients")}><Plus size={16}/> Add ingredient</button></div>
        {form.ingredients.map((item, i) => <div className="dynamic-line" key={`ingredient-${i}`}><span className="line-number">{i+1}</span><input className="plain-input" value={item} onChange={e => changeList("ingredients", i, e.target.value)} placeholder="e.g. 2 cups of flour"/>{form.ingredients.length > 1 && <button type="button" className="remove-line" onClick={() => removeList("ingredients", i)} aria-label="Remove ingredient"><X size={17}/></button>}</div>)}
      </section>
      <section className="form-section"><div className="section-title-row"><h3>Instructions</h3><button type="button" className="add-line" onClick={() => addList("instructions")}><Plus size={16}/> Add step</button></div>
        {form.instructions.map((item, i) => <div className="dynamic-line instruction-line" key={`step-${i}`}><span className="line-number">{i+1}</span><textarea className="plain-input" rows="2" value={item} onChange={e => changeList("instructions", i, e.target.value)} placeholder="Describe this step..."/>{form.instructions.length > 1 && <button type="button" className="remove-line" onClick={() => removeList("instructions", i)} aria-label="Remove step"><X size={17}/></button>}</div>)}
      </section>
      <div className="form-actions"><button type="button" className="button button-outline" onClick={() => navigate(-1)}>Cancel</button><button className="button button-orange" disabled={busy}>{busy ? "Saving..." : id ? "Save changes" : "Publish recipe"}</button></div>
    </form>
  </main>;
}
