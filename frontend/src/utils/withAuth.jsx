import { useNavigate } from 'react-router-dom';
import React, { useEffect } from 'react';

const withAuth = (WrappedComponent) => {
  const AuthComponent = (props) => {
    const router = useNavigate();

    const isAuthenticated = () => {
        if (localStorage.getItem('token')) {
            return true;
        }
        return false;
    }

    useEffect(() => {
        if (!isAuthenticated()) {
            router('/auth');
        }
    }, []);

    return isAuthenticated() ? <WrappedComponent {...props} /> : null;
  };

  return AuthComponent;
}

export default withAuth;