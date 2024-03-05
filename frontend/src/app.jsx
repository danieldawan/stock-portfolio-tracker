import * as React from "react";
import { useState } from "react";
import Sidebar from "./sidebar.jsx";
import Header from "./header.jsx";
import Footer from "./footer.jsx"; // Import the Footer component
import { NextUIProvider } from "@nextui-org/react";

function App() {
  return (
    <NextUIProvider>
      <Header />
      <div style={{ paddingTop: "100px" }}>
        {/* Adjust this value as needed */}
        <Sidebar />
        {/* Other content goes here */}
      </div>
      <Footer /> {/* Add the Footer component here */}
    </NextUIProvider>
  );
}

export default App;
