import React from 'react';

const ErrorMessage = ({ message }) => {
  return (
    <div className="alert alert-danger mt-3" role="alert">
      <strong>Error:</strong> {message}
    </div>
  );
};

export default ErrorMessage;
