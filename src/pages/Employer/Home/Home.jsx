import React, { useEffect } from 'react';
import './Home.css';
import Header from './components/Header/Header';
import HeroSection from './components/HeroSection/HeroSection';
import FeaturesSection from './components/FeaturesSection/FeaturesSection';
import AISection from './components/AISection/AISection';
// import CompanyCultureSection from './components/CompanyCultureSection/CompanyCultureSection';
import CompaniesSection from './components/CompaniesSection/CompaniesSection';
import BelongingSection from './components/BelongingSection/BelongingSection';
import CTASection from './components/CTASection/CTASection';
import Footer from './components/Footer/Footer';

const Home = () => {
  useEffect(() => {
    // Intersection Observer for scroll animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    }, observerOptions);

    // Observe all sections
    const sections = document.querySelectorAll('.scroll-section');
    sections.forEach(section => {
      observer.observe(section);
    });

    // Cleanup
    return () => {
      sections.forEach(section => {
        observer.unobserve(section);
      });
    };
  }, []);

  return (
    <div className="home">
      <Header />
      <div className="scroll-section fade-up">
        <HeroSection />
      </div>
      <div className="scroll-section fade-up">
        <FeaturesSection />
      </div>
      <div className="scroll-section fade-up">
        <AISection />
      </div>
      {/* <div className="scroll-section fade-up">
        <CompanyCultureSection />
      </div> */}
      <div className="scroll-section fade-up">
        <CompaniesSection />
      </div>
      <div className="scroll-section fade-up">
        <BelongingSection />
      </div>
      <div className="scroll-section scale-in">
        <CTASection />
      </div>
      <div className="scroll-section fade-up">
        <Footer />
      </div>
    </div>
  );
};

export default Home;