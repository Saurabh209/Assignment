import { useContext, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./Home/Dashboard/DashBoard";
import Nav from "./Home/Nav";
import { Context } from "./main";
import ShinyText from "../reactBitsComponents/ShinyText/ShinyText";

function App() {

  const { loading, setLoading } = useContext(Context);

  if (loading) return (
    <div className="loading-screen">
      <ShinyText
        text="Verifying session..."
        disabled={false}
        speed={3}
        className="custom-class"
      />

      {/* <div className="loading-warning">
        ⚠️ Initial load may take 30–40 seconds.
        Backend is hosted on Render (cold start).
        ⚠️Avoid mobile or private/incognito mode — they block cross-site cookies and the app may misbehave.
      </div> */}
    </div>
  )

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
