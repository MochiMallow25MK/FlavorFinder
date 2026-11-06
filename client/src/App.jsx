import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import RecipeForm from "./pages/RecipeForm";
import RecipeDetails from "./pages/RecipeDetails";
import RecipeLists from "./pages/RecipeLists";
import Pantry from "./pages/Pantry";

export default function App() {
  return <>
    <Navbar/>
    <Toaster position="top-right" toastOptions={{ duration: 2800 }}/>
    <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/login" element={<Auth mode="login"/>}/>
      <Route path="/register" element={<Auth mode="register"/>}/>
      <Route path="/recipes/:id" element={<RecipeDetails/>}/>
      <Route path="/pantry" element={<Pantry/>}/>
      <Route path="/recipes/new" element={<ProtectedRoute><RecipeForm/></ProtectedRoute>}/>
      <Route path="/recipes/:id/edit" element={<ProtectedRoute><RecipeForm/></ProtectedRoute>}/>
      <Route path="/my-recipes" element={<ProtectedRoute><RecipeLists/></ProtectedRoute>}/>
      <Route path="/saved" element={<ProtectedRoute><RecipeLists saved/></ProtectedRoute>}/>
      <Route path="*" element={<main className="empty-state"><h2>Page not found</h2><a href="/">Return home</a></main>}/>
    </Routes>
    <footer className="site-footer"><div className="footer-brand">FlavorFinder</div><p>Good food is even better when it's shared.</p><span>© {new Date().getFullYear()} FlavorFinder · Recipe Sharing Platform</span></footer>
  </>;
}
