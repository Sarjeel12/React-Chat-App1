import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../config/supabase";
import UserCard from "../components/UserCard";

function Users() {
  const [users, setUsers] = useState([]);
  const [loginUser, setLoginUser] = useState(null);

  const nav = useNavigate();

  useEffect(() => {
    getAllUsers();
  }, []);

  const getAllUsers = async () => {
    const stored = localStorage.getItem("chat_user");
    if (!stored) return;

    const userLogin = JSON.parse(stored);
    setLoginUser(userLogin);

    const { data, error } = await supabase
      .from("users")
      .select("*")
      .neq("id", userLogin.id);

    if (error) {
      console.log(error);
      return;
    }

    setUsers(data || []);
  };

  const createChatRoom = async (v) => {
    const userLogin = JSON.parse(localStorage.getItem("chat_user"));
    if (!userLogin) return;

    const { data } = await supabase
      .from("chat_room")
      .select("*")
      .or(
        `and(sender_id.eq.${userLogin.id},reciever_id.eq.${v.id}),and(sender_id.eq.${v.id},reciever_id.eq.${userLogin.id})`,
      )
      .maybeSingle();

    let room = data;

    if (!room) {
      const { data: newRoom } = await supabase
        .from("chat_room")
        .insert([
          {
            sender_id: userLogin.id,
            reciever_id: v.id,
            sender_name: userLogin.name,
            reciever_name: v.name,
          },
        ])
        .select()
        .single();

      room = newRoom;
    }

    nav("/chat/" + room.id);
  };

  const userElements = useMemo(() => 
    users.map((u) => (
      <UserCard key={u.id} user={u} onClick={() => createChatRoom(u)} />
    )),
    [users]
  );

  return (
    <div className="page">
      <h1 style={{ textAlign: "right" }}>
        Welcome : {loginUser ? loginUser.name : "Loading..."}
      </h1>

      <div className="page-header">
        <h1>Messages</h1>
        <p>Select someone to start a conversation</p>
      </div>

      {users.length === 0 ? (
        <div className="empty-state">
          <p>No other users yet.</p>
        </div>
      ) : (
        userElements
      )}
    </div>
  );
}

export default Users;
