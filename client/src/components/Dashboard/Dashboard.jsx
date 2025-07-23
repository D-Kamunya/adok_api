import React, { useState, useEffect } from 'react';
import { fetchDashboardData } from '../../services/api';
import Filters from './Filters';
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SummaryCards from './SummaryCards';
import TimeSeriesChart from './TimeSeriesChart';
import HierarchyChart from './HierarchyChart';
import FinancialAnalysis from './FinancialAnalysis';
import DataTable from './DataTable'; 
import AttendanceSegmentation from './AttendanceSegmentation';
import Loader from '../UI/Loader';
import './Dashboard.css';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    archdeaconry: '',
    parish: '',
    congregation: '',
    start_date: '',
    end_date: ''
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await fetchDashboardData(filters);
        setDashboardData(data);
        // setError(null);
      } catch (err) {
         if (err.response?.status === 404) {
            toast.info('No data found for the selected filters');
            setDashboardData(null);
        } else {
            toast.error('Failed to load dashboard data');
        }
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [filters]);

  if (loading && !dashboardData) return <Loader />;

  return (
    <div className="dashboard-container">
        <ToastContainer 
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <h1>Church Attendance Analytics Dashboard</h1>
      
      <Filters 
        onFilterChange={setFilters} 
        initialFilters={filters} 
      />

      {dashboardData && (
        <>
          <SummaryCards data={dashboardData.overall} />
          
          <div className="dashboard-section">
            <TimeSeriesChart data={dashboardData.time_series} />
          </div>
          
          <div className="dashboard-section">
            <HierarchyChart data={dashboardData.hierarchy} />
          </div>
          
          <div className="dashboard-section">
            <FinancialAnalysis data={dashboardData.financial} />
          </div>
          
          <div className="dashboard-section">
            <AttendanceSegmentation data={dashboardData.attendance_segmentation} />
          </div>

          {/* Add the DataTable component */}
          <div className="dashboard-section">
            <DataTable filters={filters} />
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
