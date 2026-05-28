import { getInitials } from "../utils";

function UserCard({ user, onClick }) {
  if (!user) return null

  return (
    <div
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "12px",
        borderBottom: "1px solid rgba(168, 85, 247, 0.1)",
        cursor: "pointer",
        transition: "all 0.2s",
        background: "rgba(124, 58, 237, 0.02)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <div
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, #7c3aed, #a855f7)",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "bold",
            fontSize: "14px",
            boxShadow: "0 2px 8px rgba(124, 58, 237, 0.3)",
          }}
        >
          {getInitials(user?.name || "U")}
        </div>

        <div>
          <h4 style={{ margin: 0 }}>{user.name || "Unknown User"}</h4>
          <p style={{ margin: 0, fontSize: "12px", color: "#666" }}>
            {user.email || "No email"}
          </p>
        </div>
      </div>

      <span style={{ fontSize: "18px" }}>→</span>
    </div>
  );
}

export default UserCard;
