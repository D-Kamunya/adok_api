import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  Brush
} from 'recharts';

const TimeSeriesChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (<div className="text-center py-5 text-muted">
            No time series data available
          </div>);
  }

  // Format data for chart
  const chartData = data.map(item => ({
    month: item.month,
    total_attendance: Math.round(item.total_attendance),
    total_collection: Math.round(item.total_collection)
  }));

  // Find max values for scaling
  const maxAttendance = Math.max(...chartData.map(d => d.total_attendance));
  const maxCollection = Math.max(...chartData.map(d => d.total_collection));
  
  // Calculate scale ratio
  const scaleRatio = maxCollection / maxAttendance;

  return (
    <div className="card shadow-sm mb-4">
      <div className="card-body">
        <h2 className="h5 text-dark border-bottom pb-2 mb-3">
          Attendance and Collections Over Time
        </h2>

        <div className="mb-3" style={{ height: 400 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="month" 
                tick={{ fontSize: 12 }}
                padding={{ left: 20, right: 20 }}
              />
              <YAxis 
                yAxisId="left" 
                orientation="left" 
                domain={[0, maxAttendance * 1.1]}
                tick={{ fontSize: 12 }}
                label={{ 
                  value: 'Attendance', 
                  angle: -90, 
                  position: 'insideLeft',
                  style: { textAnchor: 'middle' }
                }}
              />
              <YAxis 
                yAxisId="right" 
                orientation="right" 
                domain={[0, maxCollection * 1.1]}
                tick={{ fontSize: 12 }}
                label={{ 
                  value: 'Collections (KSH)', 
                  angle: 90, 
                  position: 'insideRight',
                  style: { textAnchor: 'middle' }
                }}
              />
              <Tooltip 
                formatter={(value, name) => {
                  if (name === 'total_collection') {
                    return [`Kshs.${value.toLocaleString()}`, 'Collections'];
                  }
                  return [value, name === 'total_attendance' ? 'Attendance' : name];
                }}
                labelFormatter={value => `Month: ${value}`}
              />
              <Legend verticalAlign="top" height={36} />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="total_attendance"
                name="Attendance"
                stroke="#8884d8"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6, stroke: '#8884d8', strokeWidth: 2, fill: '#fff' }}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="total_collection"
                name="Collections"
                stroke="#82ca9d"
                strokeWidth={2}
                strokeDasharray="3 3"
                dot={{ r: 4 }}
                activeDot={{ r: 6, stroke: '#82ca9d', strokeWidth: 2, fill: '#fff' }}
              />
              <Brush dataKey="month" height={30} stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="d-flex justify-content-between flex-wrap small text-muted">
          <p className="mb-1">Note: Collections are shown in KSH on the right axis</p>
          <div className="bg-light border-start border-primary ps-2 rounded">
            Scale ratio: Kshs.1 = {scaleRatio.toFixed(1)} attendance points
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimeSeriesChart;
