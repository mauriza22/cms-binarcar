/** @format */
import CarForm from '../pages/car/form';
import ListCar from '../pages/car/index';
import Dashboard from '../pages/dashboard/index';
import Login from '../pages/login/index';

export const privateRoutes = (props) => {
  return [
    {
      index: true,
      path: '/dashboard',
      element: <Dashboard title="Dashboard" {...props} />,
    },
    {
      index: true,
      path: '/car',
      element: <ListCar title="List Car" {...props} />,
    },
    {
      index: true,
      path: '/car/form',
      element: <CarForm title="Add New Car" {...props} />,
    },
    {
      index: true,
      path: '/car/:id/edit',
      element: <CarForm title="Created Car" {...props} />,
    },
  ];
};

export const publicRoutes = (props) => {
  return [
    {
      index: true,
      path: '/',
      element: <Login title="Login" {...props} />,
    },
    {
      index: true,
      path: '/login',
      element: <Login title="Login" {...props} />,
    },
  ];
};
