import React from 'react';
import './Home.css';
import Header from './components/Header/Header';
import HeroSection from './components/HeroSection/HeroSection';
import FeaturesSection from './components/FeaturesSection/FeaturesSection';
import AISection from './components/AISection/AISection';
import CompanyCultureSection from './components/CompanyCultureSection/CompanyCultureSection';
import CompaniesSection from './components/CompaniesSection/CompaniesSection';
import BelongingSection from './components/BelongingSection/BelongingSection';
import CTASection from './components/CTASection/CTASection';
import Footer from './components/Footer/Footer';

const Home = () => {
  return (
    <div className="home">
      <Header />
      <HeroSection />
      <FeaturesSection />
      <AISection />
      <CompanyCultureSection />
      <CompaniesSection />
      <BelongingSection />
      <CTASection />
      <Footer />
    </div>
  );
};

export default Home;