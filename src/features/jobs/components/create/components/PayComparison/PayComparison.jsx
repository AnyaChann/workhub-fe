import React from 'react';
import './PayComparison.css';

const PayComparison = ({ 
  minSalary, 
  maxSalary, 
  payType,
  category,
  occupation 
}) => {
  const getComparisonData = () => {
    // Mock comparison data based on category and occupation
    const baseSalary = category === 'technology' ? 80000 : 60000;
    const variance = 0.15;
    
    return {
      market_min: Math.round(baseSalary * (1 - variance)),
      market_max: Math.round(baseSalary * (1 + variance)),
      market_avg: baseSalary,
      your_min: parseInt(minSalary) || 0,
      your_max: parseInt(maxSalary) || 0
    };
  };

  const data = getComparisonData();
  const hasYourRange = data.your_min > 0 && data.your_max > 0;

  const formatSalary = (amount) => {
    if (payType === 'hourly-rate') {
      return `$${amount}/hr`;
    }
    return `$${amount.toLocaleString()}`;
  };

  const getComparisonStatus = () => {
    if (!hasYourRange) return 'incomplete';
    
    const yourAvg = (data.your_min + data.your_max) / 2;
    const marketAvg = data.market_avg;
    
    if (yourAvg < marketAvg * 0.9) return 'below';
    if (yourAvg > marketAvg * 1.1) return 'above';
    return 'competitive';
  };

  const status = getComparisonStatus();

  const getStatusMessage = () => {
    switch (status) {
      case 'below':
        return {
          icon: '📉',
          text: 'Below market range',
          color: '#e74c3c'
        };
      case 'above':
        return {
          icon: '📈',
          text: 'Above market range',
          color: '#f39c12'
        };
      case 'competitive':
        return {
          icon: '🎯',
          text: 'Competitive range',
          color: '#27ae60'
        };
      default:
        return {
          icon: '📊',
          text: 'Enter salary range to see comparison',
          color: '#95a5a6'
        };
    }
  };

  const statusInfo = getStatusMessage();

  return (
    <div className="pay-comparison">
      <h4>Pay comparison</h4>
      <div className="comparison-chart">
        {hasYourRange ? (
          <div className="chart-content">
            <div className="salary-bars">
              <div className="salary-bar market-bar">
                <div className="bar-label">Market Range</div>
                <div className="bar-visual">
                  <div 
                    className="bar-fill market-fill"
                    style={{ width: '100%' }}
                  ></div>
                </div>
                <div className="bar-values">
                  {formatSalary(data.market_min)} - {formatSalary(data.market_max)}
                </div>
              </div>
              
              <div className="salary-bar your-bar">
                <div className="bar-label">Your Range</div>
                <div className="bar-visual">
                  <div 
                    className={`bar-fill your-fill ${status}`}
                    style={{ width: '85%' }}
                  ></div>
                </div>
                <div className="bar-values">
                  {formatSalary(data.your_min)} - {formatSalary(data.your_max)}
                </div>
              </div>
            </div>
            
            <div className={`status-indicator ${status}`}>
              <span className="status-icon">{statusInfo.icon}</span>
              <span className="status-text" style={{ color: statusInfo.color }}>
                {statusInfo.text}
              </span>
            </div>
            
            <div className="market-insights">
              <div className="insight-item">
                <span className="insight-label">Market Average:</span>
                <span className="insight-value">{formatSalary(data.market_avg)}</span>
              </div>
              <div className="insight-item">
                <span className="insight-label">Position:</span>
                <span className="insight-value">{occupation || 'General'}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="chart-placeholder">
            <div className="chart-icon">📊</div>
            <p>Analyses...</p>
            <small>We can only have benchmarked data to provide detailed insights for this job.</small>
          </div>
        )}
      </div>
    </div>
  );
};

export default PayComparison;