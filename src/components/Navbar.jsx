function Navbar({ user, onLogout }) {
  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      onLogout()
    }
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "12px 20px",
        background: "linear-gradient(135deg, #7c3aed, #a855f7)",
        color: "#fff",
        boxShadow: "0 4px 20px rgba(124, 58, 237, 0.3)",
      }}
    >
      <h3 style={{ margin: 0 }}>Chat App</h3>

      <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
        <span title={user?.email || "Not logged in"}>
          {user?.name || "Guest"}
        </span>

        <button
          onClick={handleLogout}
          title="Sign out of your account"
          aria-label="Logout button"
          style={{
            background: "rgba(255,255,255,0.95)",
            color: "#7c3aed",
            border: "none",
            padding: "6px 12px",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "600",
            transition: "all 0.2s",
            fontSize: "12px",
          }}
          onMouseEnter={(e) => (e.target.style.opacity = "0.8")}
          onMouseLeave={(e) => (e.target.style.opacity = "1")}
        >
          Logout
        </button>
      </div>
    </div>
  )
}

export default Navbar;
