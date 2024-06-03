/** @format */

import { useEffect } from 'react';
import { Navigate, useRoutes, useNavigate } from 'react-router-dom';
import { privateRoutes, publicRoutes } from './router.config';
import Layout from '../layout';

const isLoggedIn = localStorage.getItem('TOKEN');

export const AppCreatePublicRoutes = (props) => {
  const routes = useRoutes(publicRoutes(props));
  return routes ? routes : <Navigate replace to={{ pathname: '/' }} />;
};

export const AppCreatePrivateRoutes = (props) => {
  const routes = useRoutes(privateRoutes(props));
  const navigate = useNavigate();
  useEffect(() => {
    // navigate('/dashboard');
  }, [navigate]);
  return routes;
};

export const PublicRoutes = (props) => {
  if (isLoggedIn) return <Layout />;
  return <AppCreatePublicRoutes {...props} />;
};
