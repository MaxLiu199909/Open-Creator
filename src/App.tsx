import React from 'react';
import { BrowserRouter, Routes, Route, createRoutesFromElements } from 'react-router-dom';
import Hero from './components/Hero';
import ProjectsSection from './components/ProjectsSection';
import GallerySection from './components/GallerySection';
import CustomCursor from './components/CustomCursor';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LoginPage from './pages/LoginPage';
import { LanguageProvider } from './contexts/LanguageContext';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <BrowserRouter basename="/Open-Creator" future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AuthProvider>
        <LanguageProvider>
          <div className="min-h-screen bg-black text-white cursor-none">
            <CustomCursor />
            <Navbar />
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/" element={
                <>
                  <Hero />
                  <ProjectsSection />
                  <GallerySection />
                  <Footer />
                </>
              } />
            </Routes>
          </div>
        </LanguageProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;