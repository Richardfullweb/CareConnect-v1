import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Hero from '../components/Hero';
import Features from '../components/Features';
import Pricing from '../components/Pricing';
import Footer from '../components/Footer';

export default function LandingPage() {
  const navigate = useNavigate();

  // Simulated login state
  const [isLoggedIn] = React.useState(false);

  React.useEffect(() => {
    // If user is already logged in, redirect to dashboard
    if (isLoggedIn) {
      navigate('/dashboard');
    }
  }, [isLoggedIn, navigate]);

  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <Features />
      <Pricing />
      <Footer />
    </div>
  );
}