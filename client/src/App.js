import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import ViewAll from "./pages/ViewAll";
import AddNew from "./pages/AddNew";
import About from "./pages/About";
import PerformanceMonitor from "./components/PerformanceMonitor";
import ResponseSizeMonitor from "./components/ResponseSizeMonitor";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/view" element={<ViewAll />} />
        <Route path="/add" element={<AddNew />} />
        <Route path="/about" element={<About />} />
      </Routes>
      <PerformanceMonitor />
      <ResponseSizeMonitor />
    </Router>
  );
}

export default App;
