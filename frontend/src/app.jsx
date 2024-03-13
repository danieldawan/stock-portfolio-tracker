import React, { useEffect, useState } from "react";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./sidebar.jsx";
import Header from "./header.jsx";
import Content from "./content.jsx";
import LoginPage from "./loginpage.jsx";
import SignUpPage from "./signuppage.jsx"; // Make sure this matches the file name if it's SignUpPage
import { NextUIProvider } from "@nextui-org/react";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State to manage login status

  useEffect(() => {
    document.body.style.backgroundColor = "black";
  }, []);

  const handleLogin = (status) => {
    setIsLoggedIn(status); // Update login status
  };

  const handleLogout = () => {
    setIsLoggedIn(false); // Update logout status
  };

  return (
    <HashRouter>
      <NextUIProvider>
        {/* Conditionally render the Header only when logged in */}
        {isLoggedIn && <Header onLogout={handleLogout} />}
        <div
          style={{
            display: "flex",
            paddingTop: isLoggedIn ? "100px" : "0",
            minHeight: "100vh",
          }}
        >
          {isLoggedIn && (
            <div style={{ width: "22%" }}>
              <Sidebar />
            </div>
          )}
          <div style={{ flex: 1 }}>
            <Routes>
              {/* Conditionally render routes based on login status */}
              {isLoggedIn ? (
                <>
                  <Route path="/:ticker" element={<Content />} />
                  <Route path="/summary" element={<Content />} />
                  <Route
                    path="/"
                    element={<Navigate replace to="/summary" />}
                  />
                </>
              ) : (
                <>
                  <Route
                    path="/login"
                    element={<LoginPage onLogin={handleLogin} />}
                  />
                  <Route
                    path="/register" // Make sure this path matches your Link and routing setup
                    element={<SignUpPage onRegister={handleLogin} />}
                  />
                  {/* Redirect to login by default if not logged in */}
                  <Route path="/*" element={<Navigate replace to="/login" />} />
                </>
              )}
            </Routes>
          </div>
        </div>
      </NextUIProvider>
    </HashRouter>
  );
}

export default App;
