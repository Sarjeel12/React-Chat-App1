import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useEffect } from "react";

import Chat from "./pages/Chat";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Users from "./pages/Users";
import Navbar from "./components/Navbar";

import { Navigate } from "react-router-dom";
// import * as storage from "./storage";
import { useStore } from "./useStore";
import * as storage from "./storage";

function App() {
  const store = useStore();

  // useEffect(() => {
  //   const user = storage.getLoggedInUser();
  //   if (user) {
  //     store.setLoggedInUser(user); // ✅ FIXED
  //   }
  // }, []);

  useEffect(() => {
    // User is already loaded from localStorage on initial render
    // via useStore hook, so no additional sync needed
  }, []);

  return (
    <BrowserRouter basename="/React-Chat-App1/">
      <div className="app-shell">
        <Navbar user={store.user} onLogout={store.logout} />

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            <Route
              path="/users"
              element={
                <ProtectedRoute>
                  <Users />
                </ProtectedRoute>
              }
            />

            <Route
              path="/chat/:roomId"
              element={
                <ProtectedRoute>
                  <Chat />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;

function ProtectedRoute({ children }) {
  const user = storage.getLoggedInUser();

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return children;
}
