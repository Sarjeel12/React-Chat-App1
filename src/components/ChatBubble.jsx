import { getInitials } from "../utils";

function ChatBubble({ message, isMe, user }) {
  if (!message || !message.text) return null

  return (
    <div
      style={{
        display: "flex",
        justifyContent: isMe ? "flex-end" : "flex-start",
        marginBottom: "10px",
      }}
    >
      {!isMe && (
        <div
          style={{
            width: "32px",
            height: "32px",
            borderRadius: "50%",
            background: "#ddd",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginRight: "8px",
            fontSize: "12px",
          }}
        >
          {getInitials(user?.name || "U")}
        </div>
      )}

      <div
        style={{
          maxWidth: "70%",
          padding: "10px 14px",
          borderRadius: "15px",
          background: isMe ? "linear-gradient(135deg, #7c3aed, #a855f7)" : "rgba(168, 85, 247, 0.15)",
          color: isMe ? "#fff" : "#e9d5ff",
          fontSize: "14px",
          wordBreak: "break-word",
          boxShadow: isMe ? "0 4px 12px rgba(124, 58, 237, 0.3)" : "none",
        }}
      >
        {message.text}
      </div>
    </div>
  )
}

export default ChatBubble;
