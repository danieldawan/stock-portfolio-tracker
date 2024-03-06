import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom"; // Import necessary components from react-router-dom v6
import Sidebar from "./sidebar.jsx";
import Header from "./header.jsx";
import Content from "./content.jsx";
import { NextUIProvider } from "@nextui-org/react";

function App() {
  useEffect(() => {
    document.body.style.backgroundColor = "black";
  }, []);

  return (
    <BrowserRouter>
      <NextUIProvider>
        <Header />
        <div
          style={{ display: "flex", paddingTop: "100px", minHeight: "100vh" }}
        >
          <div style={{ width: "20%" }}>
            <Sidebar />
          </div>
          <div style={{ flex: 1 }}>
            {/* Setup Routes within Routes component */}
            <Routes>
              {/* Define the route for the Content component to display stock info based on ticker */}
              <Route path="/:ticker" element={<Content />} />
              {/* Optionally, define a default route or a landing page */}
              {/* Assuming Sidebar is your landing page or replace <Sidebar /> with your landing page component */}
              <Route path="/summary" element={<Content />} />
            </Routes>
          </div>
        </div>
      </NextUIProvider>
    </BrowserRouter>
  );
}

export default App;
