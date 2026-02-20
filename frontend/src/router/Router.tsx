import { createBrowserRouter, type RouteObject } from 'react-router-dom';
import App from '../App';
import Welcome from '../pages/Welcome';
import CheckServerHealth from '../pages/Health';

export const AppRoutes: RouteObject[] = [
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '',
        element: <Welcome />,
      },
      {
        path: '/check-server-health',
        element: <CheckServerHealth />,
      },
    ],
  },
];

export const router = createBrowserRouter(AppRoutes);
