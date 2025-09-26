import React, { useState, useEffect } from 'react';
import { fetchDashboardData } from '../../services/api';
import Filters from './Filters';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SummaryCards from './SummaryCards';
import TimeSeriesChart from './TimeSeriesChart';
import HierarchyChart from './HierarchyChart';
import FinancialAnalysis from './FinancialAnalysis';
import DataTable from './DataTable'; 
import AttendanceSegmentation from './AttendanceSegmentation';
import Loader from '../UI/Loader';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
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
    <div className="container my-4">
      <ToastContainer position="top-right" autoClose={5000} />

      <h1 className="text-center text-dark mb-4">
        Church Attendance Analytics Dashboard
      </h1>
      
      <Filters 
        onFilterChange={setFilters} 
        initialFilters={filters} 
      />

      {dashboardData && (
        <>
          <SummaryCards data={dashboardData.overall} />
          
          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <h5 className="card-title border-bottom pb-2">Time Series Analysis</h5>
              <TimeSeriesChart data={dashboardData.time_series} />
            </div>
          </div>

          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <h5 className="card-title border-bottom pb-2">Hierarchy Overview</h5>
              <HierarchyChart data={dashboardData.hierarchy} />
            </div>
          </div>

          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <h5 className="card-title border-bottom pb-2">Financial Analysis</h5>
              <FinancialAnalysis data={dashboardData.financial} />
            </div>
          </div>

          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <h5 className="card-title border-bottom pb-2">Attendance Segmentation</h5>
              <AttendanceSegmentation data={dashboardData.attendance_segmentation} />
            </div>
          </div>

          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <h5 className="card-title border-bottom pb-2">Detailed Data</h5>
              <DataTable filters={filters} />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
