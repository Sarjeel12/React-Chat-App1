import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../config/supabase";
import * as storage from "../storage"; 
// import { useEffect } from "react";
// import * as storage from "../storage";
// import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const user = storage.getLoggedInUser();

    if (user) {
      navigate("/users");
    }
  }, [navigate]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .eq("password", password)
      .maybeSingle();
      

    if (error || !data) {
      setError("Invalid email or password");
      return;
    }

    // ✅ 1. SAVE IN LOCAL STORAGE (IMPORTANT FIX)
    const loggedInUser = {
      id: data.id,
      name: data.name,
      email: data.email,
    };

    storage.saveLoggedInUser(loggedInUser);
    navigate("/users");
  }

  return (
    <div className="auth-page auth-page-full" style={{
      background: "linear-gradient(135deg, #1a1229 0%, #2d1b4e 50%, #3d2463 100%)",
    }}>
      <div className="auth-card">
        <div className="auth-header">
          <div className="brand-icon">💬</div>
          <h1>Welcome back</h1>
          <p>Sign in to continue chatting</p>
        </div>

        <form className="form" onSubmit={handleSubmit}>
          <div className="field">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="field">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <p className="alert-error">{error}</p>}

          <button type="submit" className="btn btn-primary">
            Sign in
          </button>
        </form>

        <p className="auth-hint">Demo: alex@test.com / 123</p>

        <p className="auth-footer">
          No account? <Link to="/signup">Create one</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
