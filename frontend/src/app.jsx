import React, { useEffect } from "react";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom"; // Import HashRouter
import Sidebar from "./sidebar.jsx";
import Header from "./header.jsx";
import Content from "./content.jsx";
import { NextUIProvider } from "@nextui-org/react";

function App() {
  useEffect(() => {
    document.body.style.backgroundColor = "black";
  }, []);

  return (
    <HashRouter>
      {" "}
      <NextUIProvider>
        <Header />
        <div
          style={{ display: "flex", paddingTop: "100px", minHeight: "100vh" }}
        >
          <div style={{ width: "22%" }}>
            <Sidebar />
          </div>
          <div style={{ flex: 1 }}>
            <Routes>
              {/* Setup Routes within Routes component */}

              {/* Define the route for the Content component to display stock info based on ticker */}
              <Route path="/:ticker" element={<Content />} />

              {/* Define the route for the Summary page */}
              <Route path="/summary" element={<Content />} />

              {/* Redirect from root to the Summary page */}
              <Route path="/" element={<Navigate replace to="/summary" />} />
            </Routes>
          </div>
        </div>
      </NextUIProvider>
    </HashRouter>
  );
}

export default App;
