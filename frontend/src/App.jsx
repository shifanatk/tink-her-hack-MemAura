import React, { useState, useEffect } from 'react';
import LoginPage from './components/LoginPage';
import Canvas from './components/Canvas';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null); // NEW: visible error

  useEffect(() => {
    console.log("App: checking auth status at /api/auth/me");

    fetch('http://localhost:8080/api/auth/me', { credentials: 'include' })
      .then(res => {
        console.log("App: /api/auth/me response status =", res.status);

        if (res.status === 401 || res.status === 403) {
          console.log("App: user is NOT logged in yet, showing LoginPage");
          setLoading(false);
          setAuthError(null); // not an error, just not logged in
          return null;
        }

        if (!res.ok) {
          const msg = `Auth fetch failed with status ${res.status}`;
          console.error("App:", msg);
          setAuthError(msg);
          throw new Error(msg);
        }

        return res.json();
      })
      .then(data => {
        if (data && data.email) {
          console.log("App: authenticated user =", data.email);
          setUser(data);
        } else {
          console.warn("App: /api/auth/me returned no user data");
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("App: network or parsing error in auth check", err);
        setAuthError("There was a problem checking your login. See console for details.");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="loading">Loading MemAura...</div>;
  }

  return (
    <div className="App">
      {/* Show a visible error if auth call itself fails */}
      {authError && (
        <div className="auth-error-banner">
          {authError}
        </div>
      )}

      {/* Canvas when logged in, otherwise Login */}
      {user && user.email ? (
        <Canvas user={user} />
      ) : (
        <LoginPage />
      )}
    </div>
  );
}

export default App;