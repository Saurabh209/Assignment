import { useState } from "react";
import { useBoard } from "../Context/BoardContext";
import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./Home/Dashboard/DashBoard";
import Nav from "./Home/Nav";

function App() {
  const { boards } = useBoard();

  return (
    <>
      <Nav />
      <Routes>
        <Route
          path="/"
          element={<Dashboard />}
        />
      </Routes>

    </>

  );
}

export default App;
