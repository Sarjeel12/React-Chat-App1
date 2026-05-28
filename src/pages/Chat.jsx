import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../config/supabase";
import ChatBubble from "../components/ChatBubble";
import { getInitials } from "../utils";

function Chat() {
  const { roomId } = useParams();
  const navigate = useNavigate();

  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);
  const [receiverUser, setReceiverUser] = useState(null);
  const [senderUser, setSenderUser] = useState(null);
  const [showEmoji, setShowEmoji] = useState(false);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!roomId) return;

    const user = JSON.parse(localStorage.getItem("chat_user"));
    setSenderUser(user);

    getRoomDetails(user);
    getMessages();

    const channel = supabase
      .channel(`room_${roomId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `room_id=eq.${roomId}`,
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new]);
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [roomId]);

  const getRoomDetails = async (user) => {
    const { data } = await supabase
      .from("chat_room")
      .select("*")
      .eq("id", roomId)
      .maybeSingle();

    if (!data) return;

    if (data.sender_id === user.id) {
      setReceiverUser({
        name: data.reciever_name,
        id: data.reciever_id,
      });
    } else {
      setReceiverUser({
        name: data.sender_name,
        id: data.sender_id,
      });
    }
  };

  const getMessages = async () => {
    const { data } = await supabase
      .from("messages")
      .select("*")
      .eq("room_id", roomId)
      .order("created_at", { ascending: true });

    setMessages(data || []);
    setLoading(false);
  };

  const handleSend = async (e) => {
    e.preventDefault();

    if (!text.trim()) return;
    if (!senderUser || !receiverUser) return;

    const newMsg = {
      room_id: roomId,
      sender_id: senderUser.id,
      text: text,
    };

    const { error } = await supabase.from("messages").insert([newMsg]);

    if (!error) {
      setText("");
    }
  };

  const addEmoji = (emoji) => {
    setText((prev) => prev + emoji);
  };

  const emojis = ["😀", "😂", "😍", "😭", "😎", "👍", "🔥", "❤️", "🙏", "👏", "😢", "🤔"];

  return (
    <div
      style={{
        height: "calc(100vh - 64px)",
        display: "flex",
        flexDirection: "column",
        background: "linear-gradient(135deg, #1a1229 0%, #2d1b4e 100%)",
        color: "#fff",
      }}
    >
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px 24px",
          background: "linear-gradient(135deg, rgba(124, 58, 237, 0.95), rgba(168, 85, 247, 0.95))",
          borderBottom: "1px solid rgba(255,255,255,0.1)",
          backdropFilter: "blur(10px)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <button
            onClick={() => navigate(-1)}
            style={{
              background: "rgba(255,255,255,0.2)",
              border: "none",
              color: "#fff",
              padding: "8px 12px",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "16px",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => (e.target.style.background = "rgba(255,255,255,0.3)")}
            onMouseLeave={(e) => (e.target.style.background = "rgba(255,255,255,0.2)")}
          >
            ← Back
          </button>
          <div
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #7c3aed, #a855f7)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "bold",
              fontSize: "16px",
              boxShadow: "0 4px 16px rgba(124, 58, 237, 0.4)",
            }}
          >
            {getInitials(receiverUser?.name || "U")}
          </div>
          <div>
            <h2 style={{ margin: "0 0 4px 0", fontSize: "18px", fontWeight: "600" }}>
              {receiverUser?.name || "Loading..."}
            </h2>
            <p style={{ margin: 0, fontSize: "12px", opacity: "0.8" }}>Online</p>
          </div>
        </div>
      </div>

      {/* MESSAGES AREA */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "20px 24px",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
        }}
      >
        {loading ? (
          <div style={{ textAlign: "center", color: "#9ca3af", margin: "auto" }}>
            <p>Loading messages...</p>
          </div>
        ) : messages.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              color: "#9ca3af",
              margin: "auto",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <p style={{ fontSize: "32px" }}>👋</p>
            <p style={{ fontSize: "14px" }}>Start your conversation with {receiverUser?.name}</p>
          </div>
        ) : (
          messages.map((msg) => (
            <ChatBubble
              key={msg.id}
              message={{ text: msg.text }}
              isMe={msg.sender_id === senderUser?.id}
              user={senderUser}
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* INPUT FORM */}
      <form
        onSubmit={handleSend}
        style={{
          display: "flex",
          gap: "12px",
          padding: "16px 24px",
          background: "rgba(31, 41, 55, 0.8)",
          borderTop: "1px solid rgba(255,255,255,0.1)",
          position: "relative",
        }}
      >
        {/* EMOJI BUTTON */}
        <button
          type="button"
          onClick={() => setShowEmoji(!showEmoji)}
          title="Add emoji"
          style={{
            border: "none",
            background: "rgba(255,255,255,0.1)",
            fontSize: "24px",
            cursor: "pointer",
            color: "#fff",
            width: "44px",
            height: "44px",
            borderRadius: "10px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => (e.target.style.background = "rgba(255,255,255,0.2)")}
          onMouseLeave={(e) => (e.target.style.background = "rgba(255,255,255,0.1)")}
        >
          😄
        </button>

        {/* INPUT */}
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
          style={{
            flex: 1,
            padding: "12px 16px",
            border: "1px solid rgba(255,255,255,0.2)",
            borderRadius: "24px",
            outline: "none",
            background: "rgba(17, 24, 39, 0.8)",
            color: "#fff",
            fontSize: "14px",
            transition: "all 0.2s",
          }}
          onFocus={(e) => {
            e.target.style.borderColor = "rgba(37, 99, 235, 0.5)";
            e.target.style.background = "rgba(17, 24, 39, 1)";
          }}
          onBlur={(e) => {
            e.target.style.borderColor = "rgba(255,255,255,0.2)";
            e.target.style.background = "rgba(17, 24, 39, 0.8)";
          }}
        />

        {/* SEND BUTTON */}
        <button
          type="submit"
          title="Send message"
          style={{
            padding: "12px 24px",
            border: "none",
            borderRadius: "24px",
            background: "linear-gradient(135deg, #7c3aed, #a855f7)",
            color: "#fff",
            cursor: "pointer",
            fontWeight: "600",
            transition: "all 0.2s",
            fontSize: "14px",
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = "translateY(-2px)";
            e.target.style.boxShadow = "0 8px 16px rgba(124, 58, 237, 0.5)";
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = "translateY(0)";
            e.target.style.boxShadow = "none";
          }}
        >
          Send
        </button>

        {/* EMOJI PANEL */}
        {showEmoji && (
          <div
            style={{
              position: "absolute",
              bottom: "70px",
              left: "24px",
              background: "rgba(26, 18, 41, 0.95)",
              backdropFilter: "blur(10px)",
              padding: "16px",
              borderRadius: "16px",
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "12px",
              width: "280px",
              border: "1px solid rgba(168, 85, 247, 0.2)",
              boxShadow: "0 8px 32px rgba(124, 58, 237, 0.3)",
            }}
          >
            {emojis.map((e) => (
              <button
                key={e}
                type="button"
                onClick={() => {
                  addEmoji(e);
                  setShowEmoji(false);
                }}
                style={{
                  fontSize: "24px",
                  cursor: "pointer",
                  background: "transparent",
                  border: "none",
                  borderRadius: "8px",
                  padding: "8px",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.1)";
                  e.currentTarget.style.transform = "scale(1.3)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.transform = "scale(1)";
                }}
              >
                {e}
              </button>
            ))}
          </div>
        )}
      </form>
    </div>
  );
}

export default Chat;
