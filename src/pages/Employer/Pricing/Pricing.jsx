import React, { useState } from 'react';
import './Pricing.css';
import Header from '../Home/components/Header/Header';
import Footer from '../Home/components/Footer/Footer';

const Pricing = () => {
  const [selectedPlan, setSelectedPlan] = useState('Plus');
  const [billingType, setBillingType] = useState('monthly');

  const pricingData = {
    monthly: {
      Standard: { price: 279, jobs: '30 day ad', applications: '100 applications' },
      Plus: { price: 359, jobs: '30 day ad', applications: '150 applications' },
      Premium: { price: 779, jobs: '30 day ad', applications: 'Unlimited applications' }
    },
    yearly: {
      Standard: { price: 2511, jobs: '30 day ad', applications: '100 applications' },
      Plus: { price: 3231, jobs: '30 day ad', applications: '150 applications' },
      Premium: { price: 7011, jobs: '30 day ad', applications: 'Unlimited applications' }
    }
  };

  const features = {
    Standard: [
      '100 apply invitations',
      'Access to all applicants',
      '30 matches to choose'
    ],
    Plus: [
      '150 apply invitations',
      'Access to all applicants',
      '50 matches to choose'
    ],
    Premium: [
      'Unlimited applications',
      'Access to all applicants',
      '100 matches to choose',
      'Post Premium Job'
    ]
  };

  const faqs = [
    {
      question: "Can I purchase additional actions and for how much?",
      answer: "Yes, you can purchase additional actions. Contact our sales team for pricing details."
    },
    {
      question: "What happens to my job after the 14 day TestDrive period?",
      answer: "After the TestDrive period, your job will continue based on your selected plan."
    },
    {
      question: "Will my account close after the 14 day TestDrive?",
      answer: "No, your account will remain active. You can continue with a paid plan."
    },
    {
      question: "If I TestDrive one plan type, can I change to another plan type when I upgrade?",
      answer: "Yes, you can change to any plan type when you upgrade from TestDrive."
    },
    {
      question: "How many TestDrive jobs can I have at one time?",
      answer: "You can have one TestDrive job at a time per account."
    },
    {
      question: "Can I purchase multiple job ads for a discount?",
      answer: "Yes, we offer volume discounts for multiple job purchases. Contact sales for details."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards, PayPal, and bank transfers for enterprise accounts."
    },
    {
      question: "Should I be enquiring about enterprise options?",
      answer: "If you're hiring for multiple positions or need custom features, enterprise options might be right for you."
    },
    {
      question: "Do I still have to pay the full amount if I expire the job early?",
      answer: "No refunds are provided for early job expiration, but you can reuse remaining credits."
    },
    {
      question: "Am I able to access contact information and resumes of applicants?",
      answer: "Yes, you get full access to applicant contact information and resumes with all plans."
    }
  ];

  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="pricing-page">
      <Header />
      
      {/* Hero Section */}
      <section className="pricing-hero">
        <div className="pricing-hero-content">
          <div className="pricing-badge">PRICING</div>
          <h1 className="pricing-hero-title">Reach great candidates today</h1>
          <p className="pricing-hero-subtitle">Start hiring with options to suit every budget.</p>
          
          <div className="billing-toggle">
            <button 
              className={`billing-btn ${billingType === 'monthly' ? 'active' : ''}`}
              onClick={() => setBillingType('monthly')}
            >
              Pay upfront
            </button>
            <button 
              className={`billing-btn ${billingType === 'yearly' ? 'active' : ''}`}
              onClick={() => setBillingType('yearly')}
            >
              by TestDrive
            </button>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="pricing-cards-section">
        <div className="pricing-container">
          <div className="pricing-cards">
            {Object.keys(pricingData[billingType]).map((plan) => (
              <div 
                key={plan}
                className={`pricing-card ${plan.toLowerCase()} ${selectedPlan === plan ? 'selected' : ''}`}
              >
                <div className="pricing-card-header">
                  <h3 className="plan-name">{plan}</h3>
                  <div className="plan-job-info">{pricingData[billingType][plan].jobs}</div>
                  <div className="plan-price">
                    <span className="currency">$</span>
                    <span className="amount">{pricingData[billingType][plan].price}</span>
                  </div>
                  <div className="plan-applications">{pricingData[billingType][plan].applications}</div>
                  <div className="plan-jobs-note">{plan === 'Premium' ? 'Post Premium Job' : 'Post Standard Job'}</div>
                </div>
                
                <div className="pricing-card-features">
                  <h4>Included with plan:</h4>
                  <ul>
                    {features[plan].map((feature, index) => (
                      <li key={index}>
                        <span className="check-icon">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <button 
                  className="select-plan-btn"
                  onClick={() => setSelectedPlan(plan)}
                >
                  Select
                </button>
              </div>
            ))}
          </div>
          
          <p className="pricing-note">
            During TestDrive, candidate personal and contact information will be hidden when previewing resumes and applications.
          </p>
          
          <div className="contact-sales">
            <span>Looking for high volume options? </span>
            <a href="#contact" className="contact-link">Contact sales →</a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="pricing-features-section">
        <div className="pricing-container">
          <div className="features-header">
            <div className="features-icon">⚡</div>
            <h2>Faster hires with matches</h2>
          </div>
          
          <p className="features-description">
            Every job posted to WorkHub® (including TestDrive) comes with <strong>300 free apply invitations</strong> allowing you to entice 
            matched candidates to apply.
          </p>
          
          <p className="features-description">
            Apply invitations allow you to connect with matched candidates immediately. Plus and Premium plan users with 
            advanced candidate search unlock Additional ways to boost every invitation via enhanced job boosts and priority 
            support via live chat.
          </p>
          
          <div className="features-comparison">
            <div className="comparison-card">
              <h3>Standard</h3>
              <ul>
                <li><span className="check">✓</span> 100 apply invitations</li>
                <li><span className="check">✓</span> 20 search unlocks</li>
              </ul>
              <p className="upgrade-note">Require upgrade for duplication use</p>
            </div>
            
            <div className="comparison-card">
              <h3>Plus</h3>
              <ul>
                <li><span className="check">✓</span> 150 apply invitations</li>
                <li><span className="check">✓</span> 30 search unlocks</li>
              </ul>
            </div>
            
            <div className="comparison-card featured">
              <h3>Premium</h3>
              <ul>
                <li><span className="check">✓</span> 300 apply invitations</li>
                <li><span className="check">✓</span> 50 search unlocks</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="pricing-cta-section">
        <div className="cta-container">
          <div className="cta-content">
            <h2>Discover your next hire today</h2>
            
            <div className="cta-card">
              <div className="cta-image">
                <img src="/api/placeholder/400/300" alt="Happy professional" />
              </div>
              
              <div className="cta-form">
                <div className="trial-badge">PERFECT YOUR FUTURE</div>
                <h3>Try out all features FREE for 14 days with TestDrive</h3>
                
                <ul className="trial-features">
                  <li>Free 14 day trial</li>
                  <li>Promote candidate to shortlist</li>
                  <li>Unlimited number to apply to jobs ads</li>
                  <li>Shortlist - claim CVs, contact and hire</li>
                  <li>Live chat with our support team</li>
                  <li>No payment or credit cards required until hire</li>
                </ul>
                
                <div className="cta-buttons">
                  <button className="cta-btn primary">Post a job</button>
                  <button className="cta-btn secondary">Learn about TestDrive</button>
                </div>
              </div>
            </div>
            
            <div className="enterprise-contact">
              <h4>Got a high volume of job listings?</h4>
              <p>Contact our sales team for our custom Enterprise options</p>
              <a href="#contact" className="contact-sales-link">Contact sales →</a>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="pricing-faq-section">
        <div className="pricing-container">
          <h2 className="faq-title">Pricing FAQs</h2>
          
          <div className="faq-list">
            {faqs.map((faq, index) => (
              <div key={index} className="faq-item">
                <button 
                  className="faq-question"
                  onClick={() => toggleFaq(index)}
                >
                  {faq.question}
                  <span className={`faq-icon ${openFaq === index ? 'open' : ''}`}>+</span>
                </button>
                {openFaq === index && (
                  <div className="faq-answer">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Pricing;