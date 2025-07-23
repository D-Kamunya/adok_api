import React from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Cell,
  CartesianGrid
} from 'recharts';
import './FinancialAnalysis.css';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const FinancialAnalysis = ({ data }) => {
  if (!data) return null;

  const bankedData = [
    { name: 'Banked', value: data.banked_percentage },
    { name: 'Not Banked', value: 100 - data.banked_percentage }
  ];

  const topCongregations = Object.entries(data.top_congregations || {})
    .map(([name, value]) => ({ name, value }));

  return (
    <div className="financial-container">
      <h2>Financial Analysis</h2>
      
      <div className="financial-grid">
        <div className="financial-item">
          <h3>Banked vs Unbanked Collections</h3>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={bankedData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {bankedData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value.toFixed(2)}%`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="financial-item">
          <h3>Top Congregations by Collection</h3>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topCongregations}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => `Kshs${value.toLocaleString()}`} />
                <Bar dataKey="value" fill="#8884d8">
                  {topCongregations.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialAnalysis;
