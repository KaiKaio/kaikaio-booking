import React, { useEffect, useState } from 'react';
import { Redirect, useLocation } from 'react-router-dom';

const WithAuth = (Component) => {
  return function AuthenticatedComponent(props) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const location = useLocation();
    const token = localStorage.getItem('token');//假设Token存储在localStorage中

    useEffect(() => {
      if (token) {
        verifyToken(token).then((result) => {
          setIsAuthenticated(result);
          setLoading(false);
        });
      } else {
        setLoading(false);
      }
    }, [token]);

    if (loading) {
      return <div>Loading...</div>;
    }

    if (!token) {
      return <Redirect to="/" />;
    }

    if (!isAuthenticated) {
      return <Redirect to="/" />;
    }

    return <Component {...props} />;
  };
};

export default WithAuth