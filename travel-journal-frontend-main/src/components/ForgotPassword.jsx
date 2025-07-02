import React, { useState } from 'react';

function ForgotPassword() {
  const [email, setEmail] = useState('');

  const handleReset = () => {
    if (email) {
      alert('Password reset link sent to ' + email);
      // Add actual reset password logic here
    } else {
      alert('Please enter your email');
    }
  };

  return (
    <div className="container mt-5">
      <div className="col-md-6 mx-auto">
        <h2>Forgot Password</h2>
        <p>Enter your registered email, and we'll send you a link to reset your password.</p>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email Address</label>
          <input
            type="email"
            className="form-control"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
          />
        </div>
        <button onClick={handleReset} className="btn btn-primary">Send Reset Link</button>
        <p className="mt-3">
          <Link to="/login" className="text-primary">Back to Sign In</Link>
        </p>
      </div>
    </div>
  );
}

export default ForgotPassword;
