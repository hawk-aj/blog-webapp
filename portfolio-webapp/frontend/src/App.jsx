import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Home from './pages/Home.jsx';
import About from './pages/About.jsx';
import Work from './pages/Work.jsx';
import Blogs from './pages/Blogs.jsx';
import BlogPost from './pages/BlogPost.jsx';
import Ramblings from './pages/Ramblings.jsx';
import Contact from './pages/Contact.jsx';
import AdminLogin from './pages/admin/AdminLogin.jsx';
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import './App.css';

function AppContent() {
  const location = useLocation();
  const isAdmin  = location.pathname.startsWith('/admin');

  return (
    <div className="App">
      {!isAdmin && <Navbar />}
      <main>
        <Routes>
          <Route path="/"                  element={<Home />} />
          <Route path="/about"             element={<About />} />
          <Route path="/work"              element={<Work />} />
          <Route path="/blogs"             element={<Blogs />} />
          <Route path="/blogs/:id"         element={<BlogPost />} />
          <Route path="/ramblings"         element={<Ramblings />} />
          <Route path="/contact"           element={<Contact />} />
          <Route path="/admin"             element={<AdminLogin />} />
          <Route path="/admin/dashboard"   element={<AdminDashboard />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
