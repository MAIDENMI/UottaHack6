import React from "react";
import MapComponent from "./Components/MapComponent";
import Sidebar from "./Components/Sidebar";
import "./App.css";



export default function App() {
  return (
    <div className="app">
      <MapComponent />
      <Sidebar />
    </div>
  );
}
