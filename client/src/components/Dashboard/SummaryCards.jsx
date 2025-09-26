import React from 'react';

const SummaryCards = ({ data }) => {
  if (!data) return null;

  return (
    <div className="row g-3 mb-4">
      <div className="col-12 col-sm-6 col-lg-3">
        <div className="card shadow-sm text-center h-100">
          <div className="card-body">
            <h3 className="h6 text-secondary">Total Collected</h3>
            <div className="fs-2 fw-bold my-2">
              Kshs.{data.total_total_collection?.toLocaleString() || "0"}
            </div>
            <p className="text-muted mb-0">All-time collections</p>
          </div>
        </div>
      </div>

      <div className="col-12 col-sm-6 col-lg-3">
        <div className="card shadow-sm text-center h-100">
          <div className="card-body">
            <h3 className="h6 text-secondary">Avg Weekly Attendance</h3>
            <div className="fs-2 fw-bold my-2">
              {Math.round(data.avg_weekly_attendance) || "0"}
            </div>
            <p className="text-muted mb-0">Last 12 months average</p>
          </div>
        </div>
      </div>

      <div className="col-12 col-sm-6 col-lg-3">
        <div className="card shadow-sm text-center h-100">
          <div className="card-body">
            <h3 className="h6 text-secondary">Growth Rate</h3>
            <div
              className={`fs-2 fw-bold my-2 ${
                data.growth_rate > 0 ? "text-success" : "text-danger"
              }`}
            >
              {data.growth_rate?.toFixed(1) || "0"}%
            </div>
            <p className="text-muted mb-0">Quarterly attendance trend</p>
          </div>
        </div>
      </div>

      <div className="col-12 col-sm-6 col-lg-3">
        <div className="card shadow-sm text-center h-100">
          <div className="card-body">
            <h3 className="h6 text-secondary">Banked Percentage</h3>
            <div className="fs-2 fw-bold my-2">
              {data.banked_percentage?.toFixed(1) || "0"}%
            </div>
            <p className="text-muted mb-0">Of total collections</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryCards;
