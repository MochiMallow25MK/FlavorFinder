import { Link, NavLink, useNavigate } from "react-router-dom";
import { ChefHat, Bookmark, PlusCircle, LogOut, UserRound, Search } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const leave = () => { logout(); navigate("/"); };
  return (
    <header className="navbar">
      <div className="nav-inner">
        <Link to="/" className="brand"><span className="brand-mark"><ChefHat size={23}/></span><span>Flavor<span>Finder</span></span></Link>
        <nav className="nav-links">
          <NavLink to="/" end><Search size={16}/> Discover</NavLink>
          <NavLink to="/pantry"><span className="nav-dot"/> Pantry matcher</NavLink>
          {user && <NavLink to="/saved"><Bookmark size={16}/> Saved</NavLink>}
          {user && <NavLink to="/my-recipes">My recipes</NavLink>}
        </nav>
        <div className="nav-actions">
          {user ? <>
            <Link className="button button-orange button-small" to="/recipes/new"><PlusCircle size={16}/> Share recipe</Link>
            <span className="user-chip"><UserRound size={15}/>{user.name.split(" ")[0]}</span>
            <button className="icon-button nav-logout" onClick={leave} aria-label="Log out" title="Log out"><LogOut size={18}/></button>
          </> : <>
            <Link className="nav-login" to="/login">Log in</Link>
            <Link className="button button-orange button-small" to="/register">Join free</Link>
          </>}
        </div>
      </div>
    </header>
  );
}
