import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ChefHat, Mail, Lock, UserRound, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

export default function Auth({ mode }) {
  const isRegister = mode === "register";
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [busy, setBusy] = useState(false);
  const update = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (isRegister) await register(form);
      else await login({ email: form.email, password: form.password });
      toast.success(isRegister ? "Welcome to FlavorFinder!" : "Welcome back!");
      navigate(location.state?.from?.pathname || "/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not complete authentication.");
    } finally { setBusy(false); }
  };

  return (
    <main className="auth-layout">
      <div className="auth-art"><div className="auth-art-content"><span className="hero-kicker"><ChefHat size={16}/> FLAVORFINDER COMMUNITY</span><h1>Good things<br/>happen in the<br/><em>kitchen.</em></h1><p>Keep your favorite recipes close and discover something new to cook.</p><img src="https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=900&q=85" alt="Fresh ingredients on a kitchen table"/></div></div>
      <div className="auth-form-wrap"><form className="auth-form" onSubmit={submit}>
        <div className="auth-logo"><span className="brand-mark"><ChefHat size={22}/></span><span>FlavorFinder</span></div>
        <span className="section-kicker">{isRegister ? "JOIN THE TABLE" : "WELCOME BACK"}</span>
        <h2>{isRegister ? "Create your account" : "Log in to your kitchen"}</h2>
        <p className="muted">{isRegister ? "Share recipes and save your next favorites." : "Your saved recipes are waiting for you."}</p>
        {isRegister && <label className="field-label">Full name<div className="input-wrap"><UserRound size={18}/><input name="name" value={form.name} onChange={update} placeholder="Your name" required maxLength="60"/></div></label>}
        <label className="field-label">Email address<div className="input-wrap"><Mail size={18}/><input type="email" name="email" value={form.email} onChange={update} placeholder="you@example.com" required/></div></label>
        <label className="field-label">Password<div className="input-wrap"><Lock size={18}/><input type="password" name="password" value={form.password} onChange={update} placeholder="At least 8 characters" required minLength="8"/></div></label>
        <button className="button button-orange auth-submit" disabled={busy}>{busy ? "Please wait..." : isRegister ? "Create account" : "Log in"} <ArrowRight size={17}/></button>
        <p className="auth-switch">{isRegister ? "Already have an account?" : "New to FlavorFinder?"} <Link to={isRegister ? "/login" : "/register"}>{isRegister ? "Log in" : "Create an account"}</Link></p>
      </form></div>
    </main>
  );
}
