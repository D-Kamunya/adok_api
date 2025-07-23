import React from 'react';
import './SummaryCards.css';

const SummaryCards = ({ data }) => {
  if (!data) return null;

  return (
    <div className="summary-cards">
      <div className="summary-card">
        <h3>Total Collected</h3>
        <div className="value">
          Kshs.{data.total_total_collection?.toLocaleString() || '0'}
        </div>
        <p>All-time collections</p>
      </div>
      
      <div className="summary-card">
        <h3>Avg Weekly Attendance</h3>
        <div className="value">
          {Math.round(data.avg_weekly_attendance) || '0'}
        </div>
        <p>Last 12 months average</p>
      </div>
      
      <div className="summary-card">
        <h3>Growth Rate</h3>
        <div className={`value ${data.growth_rate > 0 ? 'positive' : 'negative'}`}>
          {data.growth_rate?.toFixed(1) || '0'}%
        </div>
        <p>Quarterly attendance trend</p>
      </div>
      
      <div className="summary-card">
        <h3>Banked Percentage</h3>
        <div className="value">
          {data.banked_percentage?.toFixed(1) || '0'}%
        </div>
        <p>Of total collections</p>
      </div>
    </div>
  );
};

export default SummaryCards;
