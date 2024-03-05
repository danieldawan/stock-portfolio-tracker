import * as React from "react";
import { useState } from "react";
import Sidebar from "./sidebar.jsx";
import { NextUIProvider } from "@nextui-org/react";

function App() {
  return (
    <NextUIProvider>
      <Sidebar />
    </NextUIProvider>
  );
}

export default App;
