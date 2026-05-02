
import React from 'react';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop.jsx';
import HomePage from './pages/HomePage.jsx';
import SeoPage from './pages/SeoPage.jsx';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/tirages" element={<SeoPage pathname="/tirages" />} />
        <Route path="/tirage-runes-en-ligne" element={<SeoPage pathname="/tirage-runes-en-ligne" />} />
        <Route path="/tirage-amour" element={<SeoPage pathname="/tirage-amour" />} />
        <Route path="/tirage-professionnel" element={<SeoPage pathname="/tirage-professionnel" />} />
        <Route path="/tirage-finances" element={<SeoPage pathname="/tirage-finances" />} />
        <Route path="/comment-ca-marche" element={<SeoPage pathname="/comment-ca-marche" />} />
        <Route path="/faq" element={<SeoPage pathname="/faq" />} />
      </Routes>
    </Router>
  );
}

export default App;
