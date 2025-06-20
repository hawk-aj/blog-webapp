import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import About from './pages/About';
import Work from './pages/Work';
import Blogs from './pages/Blogs';
import BlogPost from './pages/BlogPost';
import Ramblings from './pages/Ramblings';
import Contact from './pages/Contact';
import './App.css';

// const { registerFont, createCanvas } = require('canvas');
// registerFont(require("@canvas-fonts/helveticaneue"), { family: "HelveticaNeue" });

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/work" element={<Work />} />
            <Route path="/blogs" element={<Blogs />} />
            <Route path="/blogs/:id" element={<BlogPost />} />
            <Route path="/ramblings" element={<Ramblings />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
