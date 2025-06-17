import React, { useState } from 'react';
import './JobCheckout.css';

const JobCheckout = ({ jobData, onBack, onPayment }) => {
  const [selectedPlan, setSelectedPlan] = useState('plus');
  const [paymentMethod, setPaymentMethod] = useState('pay-upfront');
  const [billingInfo, setBillingInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    companyName: '',
    abn: '',
    address: '',
    address2: '',
    country: 'Australia',
    state: '',
    postCode: '',
    promoCode: ''
  });
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [expiryDate, setExpiryDate] = useState('');
  const [receiveNotifications, setReceiveNotifications] = useState(true);

  const plans = {
    standard: {
      name: 'Standard',
      days: 30,
      price: 199,
      originalPrice: null,
      popular: false,
      features: [
        '100 apply invitations',
        'Access to all profiles',
        'No featured unlocks'
      ]
    },
    plus: {
      name: 'Plus',
      days: 40,
      price: 199,
      originalPrice: 299,
      popular: true,
      features: [
        '100 apply invitations',
        'Access to all profiles',
        '20 matches unlocks'
      ]
    },
    premium: {
      name: 'Premium',
      days: 60,
      price: 279,
      originalPrice: 399,
      popular: false,
      features: [
        '100 apply invitations',
        'Access to all profiles',
        '50 matches unlocks'
      ]
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBillingInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculateTotal = () => {
    const plan = plans[selectedPlan];
    const subtotal = plan.price;
    const gst = subtotal * 0.1; // 10% GST
    return {
      subtotal,
      gst,
      total: subtotal + gst
    };
  };

  const handlePayment = () => {
    const paymentData = {
      jobData,
      plan: selectedPlan,
      planDetails: plans[selectedPlan],
      billingInfo,
      pricing: calculateTotal(),
      paymentMethod,
      startDate,
      expiryDate
    };
    
    if (onPayment) {
      onPayment(paymentData);
    }
  };

  const isFormValid = () => {
    return billingInfo.firstName.trim() &&
           billingInfo.lastName.trim() &&
           billingInfo.email.trim() &&
           billingInfo.companyName.trim() &&
           startDate &&
           expiryDate;
  };

  return (
    <div className="job-checkout-container">
      {/* Header */}
      <div className="checkout-header">
        <button className="back-btn" onClick={onBack}>
          <span className="back-icon">←</span>
          Back
        </button>
        <h1>Ad options</h1>
      </div>

      {/* Payment Method Toggle */}
      <div className="payment-method-toggle">
        <button 
          className={`toggle-btn ${paymentMethod === 'pay-upfront' ? 'active' : ''}`}
          onClick={() => setPaymentMethod('pay-upfront')}
        >
          Pay upfront
        </button>
        <button 
          className={`toggle-btn ${paymentMethod === 'testdrive' ? 'active' : ''}`}
          onClick={() => setPaymentMethod('testdrive')}
        >
          TestDrive <span className="small-text">7 different markets</span>
        </button>
      </div>

      {/* Pricing Plans */}
      <div className="pricing-plans">
        {Object.entries(plans).map(([key, plan]) => (
          <div 
            key={key}
            className={`pricing-card ${selectedPlan === key ? 'selected' : ''} ${plan.popular ? 'popular' : ''}`}
            onClick={() => setSelectedPlan(key)}
          >
            {plan.popular && <div className="popular-badge">POPULAR</div>}
            
            <div className="plan-header">
              <h3>{plan.name}</h3>
              <div className="plan-duration">{plan.days} day ad</div>
            </div>
            
            <div className="plan-pricing">
              <div className="price-main">${plan.price}</div>
              {plan.originalPrice && (
                <div className="price-original">${plan.originalPrice}</div>
              )}
              <div className="price-save">Save 34%</div>
            </div>
            
            <div className="plan-type">Post {plan.name} job</div>
            
            {selectedPlan === key && (
              <button className="selected-btn">Selected</button>
            )}
            
            <div className="plan-features">
              {plan.features.map((feature, index) => (
                <div key={index} className="feature-item">
                  <span className="feature-icon">✓</span>
                  {feature}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Notifications and Dates */}
      <div className="checkout-options">
        <div className="option-section">
          <h3>Receive apply notifications via email</h3>
          <div className="notification-settings">
            <label className="checkbox-label">
              <input 
                type="checkbox" 
                checked={receiveNotifications}
                onChange={(e) => setReceiveNotifications(e.target.checked)}
              />
              All email addresses
            </label>
            <input 
              type="email" 
              placeholder="Add multiple emails with a space or enter key"
              className="email-input"
            />
          </div>
        </div>

        <div className="option-section">
          <h3>Start and expiry dates</h3>
          <div className="date-inputs">
            <div className="date-group">
              <label>Start date</label>
              <input 
                type="date" 
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div className="date-group">
              <label>Expiry date</label>
              <input 
                type="date" 
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                min={startDate}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Checkout Form */}
      <div className="checkout-form">
        <h2>Checkout</h2>
        
        <div className="form-sections">
          {/* Billing Details */}
          <div className="billing-section">
            <h3>Billing details</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>First name</label>
                <input 
                  type="text" 
                  name="firstName"
                  value={billingInfo.firstName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Last name</label>
                <input 
                  type="text" 
                  name="lastName"
                  value={billingInfo.lastName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input 
                  type="email" 
                  name="email"
                  value={billingInfo.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input 
                  type="tel" 
                  name="phone"
                  value={billingInfo.phone}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Company name</label>
                <input 
                  type="text" 
                  name="companyName"
                  value={billingInfo.companyName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>ABN (optional)</label>
                <input 
                  type="text" 
                  name="abn"
                  value={billingInfo.abn}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div className="address-section">
              <div className="form-group full-width">
                <label>Address</label>
                <input 
                  type="text" 
                  name="address"
                  value={billingInfo.address}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group full-width">
                <label>Address 2</label>
                <input 
                  type="text" 
                  name="address2"
                  value={billingInfo.address2}
                  onChange={handleInputChange}
                  placeholder="Apartment or suite"
                />
              </div>
              <div className="form-grid">
                <div className="form-group">
                  <label>Country</label>
                  <select 
                    name="country"
                    value={billingInfo.country}
                    onChange={handleInputChange}
                  >
                    <option value="Australia">Australia</option>
                    <option value="Vietnam">Vietnam</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>State</label>
                  <select 
                    name="state"
                    value={billingInfo.state}
                    onChange={handleInputChange}
                  >
                    <option value="">Select a state</option>
                    <option value="NSW">NSW</option>
                    <option value="VIC">VIC</option>
                    <option value="QLD">QLD</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Post Code</label>
                  <input 
                    type="text" 
                    name="postCode"
                    value={billingInfo.postCode}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="order-summary">
            <h3>Order summary</h3>
            <div className="summary-details">
              <div className="summary-row">
                <span>Plus - upfront x 1</span>
                <span>${calculateTotal().subtotal.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Subtotal</span>
                <span>${calculateTotal().subtotal.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>GST</span>
                <span>${calculateTotal().gst.toFixed(2)}</span>
              </div>
              
              <div className="promo-section">
                <input 
                  type="text" 
                  placeholder="Promo code"
                  name="promoCode"
                  value={billingInfo.promoCode}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="summary-row total">
                <span>Total</span>
                <span>${calculateTotal().total.toFixed(2)}</span>
              </div>
            </div>

            <div className="payment-info">
              <h4>Payment method</h4>
              <div className="payment-icons">
                <span className="payment-icon">💳</span>
                <span className="payment-icon">🏦</span>
              </div>
              
              <div className="card-info">
                <div className="form-group">
                  <label>Cardholder name</label>
                  <input type="text" />
                </div>
                <div className="form-group">
                  <label>Card number</label>
                  <input type="text" />
                </div>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Expiry</label>
                    <input type="text" placeholder="MM/YY" />
                  </div>
                  <div className="form-group">
                    <label>CVV</label>
                    <input type="text" />
                  </div>
                </div>
                
                <label className="checkbox-label">
                  <input type="checkbox" />
                  Save credit card for future checkout
                </label>
              </div>

              <button 
                className="pay-btn"
                onClick={handlePayment}
                disabled={!isFormValid()}
              >
                Pay & post job
              </button>
              
              <p className="terms-text">
                By clicking 'Pay & post job' you agree to our{' '}
                <a href="#">Terms of Service</a> and{' '}
                <a href="#">Privacy Policy</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobCheckout;