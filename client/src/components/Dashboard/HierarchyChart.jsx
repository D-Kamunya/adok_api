import React from 'react';
import {
  ResponsiveContainer,
  Treemap,
  Tooltip
} from 'recharts';

const HierarchyChart = ({ data }) => {
  if (!data || !data.length) return null;

  // Transform data for Treemap
  const transformData = (hierarchyData) => {
    return hierarchyData.reduce((acc, item) => {
      const archdeaconry = acc.find(a => a.name === item.archdeaconry_name);
      
      if (!archdeaconry) {
        acc.push({
          name: item.archdeaconry_name,
          value: item.total_attendance,
          children: [{
            name: item.parish_name,
            value: item.total_attendance,
            children: [{
              name: item.congregation_name,
              value: item.total_attendance,
              collections: item.collected
            }]
          }]
        });
      } else {
        const parish = archdeaconry.children.find(p => p.name === item.parish_name);
        
        if (!parish) {
          archdeaconry.children.push({
            name: item.parish_name,
            value: item.total_attendance,
            children: [{
              name: item.congregation_name,
              value: item.total_attendance,
              collections: item.collected
            }]
          });
        } else {
          parish.children.push({
            name: item.congregation_name,
            value: item.total_attendance,
            collections: item.collected
          });
        }
      }
      
      return acc;
    }, []);
  };

  const treeData = transformData(data);

  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload) return null;
    const { name, value, collections } = payload[0].payload;
    
    return (
      <div className="bg-white border rounded p-2 shadow-sm">
        <p className="fw-bold mb-1">{name}</p>
        <p className="mb-1 text-secondary">Attendance: {Math.round(value)}</p>
        {collections && (
          <p className="mb-0 text-secondary">
            Collections: ${collections.toLocaleString()}
          </p>
        )}
      </div>
    );
  };

  return (
    <div className="card shadow-sm mb-4">
      <div className="card-body">
        <h2 className="h5 text-dark border-bottom pb-2 mb-3">Hierarchical View</h2>
        <div style={{ height: 400 }}>
          <ResponsiveContainer width="100%" height="100%">
            <Treemap
              data={treeData}
              dataKey="value"
              aspectRatio={4 / 3}
              stroke="#fff"
              fill="#8884d8"
            >
              <Tooltip content={<CustomTooltip />} />
            </Treemap>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default HierarchyChart;
