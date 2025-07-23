import React from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import './AttendanceSegmentation.css';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const AttendanceSegmentation = ({ data }) => {
  if (!data) return null;

  const pieData = [
    { name: 'Sunday School', value: data.sunday_school_avg },
    { name: 'Adults', value: data.adults_avg },
    { name: 'Youth', value: data.youth_avg },
    { name: 'Diff. Abled', value: data.diff_abled_avg }
  ];

  const barData = [
    { name: 'Sunday School', percentage: data.segmentation_ratio.sunday_school },
    { name: 'Adults', percentage: data.segmentation_ratio.adults },
    { name: 'Youth', percentage: data.segmentation_ratio.youth },
    { name: 'Diff. Abled', percentage: data.segmentation_ratio.diff_abled }
  ];

  return (
    <div className="attendance-segmentation">
      <h2>Attendance Segmentation</h2>
      
      <div className="segmentation-grid">
        <div className="segmentation-item">
          <h3>Average Attendance by Group</h3>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => Math.round(value)} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="segmentation-item">
          <h3>Attendance Distribution</h3>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis unit="%" />
                <Tooltip formatter={(value) => `${value.toFixed(1)}%`} />
                <Legend />
                <Bar dataKey="percentage" fill="#8884d8">
                  {barData.map((entry, index) => (
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

export default AttendanceSegmentation;
