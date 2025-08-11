import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Home from './pages/Home.jsx';
import About from './pages/About.jsx';
import Work from './pages/Work.jsx';
import Blogs from './pages/Blogs.jsx';
import BlogPost from './pages/BlogPost.jsx';
import Ramblings from './pages/Ramblings.jsx';
import Contact from './pages/Contact.jsx';
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
