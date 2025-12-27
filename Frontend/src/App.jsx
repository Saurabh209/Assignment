import { useContext, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./Home/Dashboard/DashBoard";
import Nav from "./Home/Nav";
import { Context } from "./main";
import ShinyText from "../reactBitsComponents/ShinyText/ShinyText";
import MainLoader from './MainLoader'

function App() {

  const { loading, setLoading } = useContext(Context);

  if (loading) return (
    // <div className="loading-screen">
    //   <ShinyText
    //     text="Verifying session..."
    //     disabled={false}
    //     speed={3}
    //     className="custom-class"
    //   />

    //   <div className="loading-warning">
    //     ⚠️ Initial load may take 30–40 seconds.
    //     Backend is hosted on Render (cold start).

    //   </div>
    // </div>

    <MainLoader />
  )

  return (
    <>
      {/* <Nav /> */}
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
