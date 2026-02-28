import { useState } from "react";

export default function LoginPage() {
  const handleGoogleLogin = () => {
    // This directs the user to your Spring Boot Google OAuth endpoint
    window.location.href = "http://localhost:8080/oauth2/authorization/google";
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h1>MemAura ✨</h1>
        <p className="subtitle">Pour your creativity. Calm your mind.</p>

        <div className="auth-content">
          <p>Welcome! Please sign in to access your scrapbook.</p>
          
          <button onClick={handleGoogleLogin} className="google-btn">
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_Reference_Logo.svg" 
              alt="Google logo" 
              className="google-icon"
            />
            Continue with Google
          </button>
        </div>

        <p className="footer-text">
          By signing in, you can save your pins to your personal account.
        </p>
      </div>
    </div>
  );
}