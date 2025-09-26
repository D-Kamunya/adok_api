import React from 'react';

const Loader = () => {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center" style={{ height: "200px" }}>
      <div className="spinner-border text-primary" role="status" style={{ width: "3rem", height: "3rem" }}>
        <span className="visually-hidden">Loading...</span>
      </div>
      <p className="mt-3">Loading data...</p>
    </div>
  );
};

export default Loader;
