import { createBrowserRouter, type RouteObject } from 'react-router-dom';
import App from '../App';
import Welcome from '../pages/Welcome';
import CheckServerHealth from '../pages/Health';
import Transfer from '../pages/Transfer';
import IndividualTransferRequestDetails from '../components/IndividualTransferRequestDetails';

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
      {
        path: '/transfer',
        element: <Transfer />,
      },
      {
        path: '/transfer-details/:workflowId',
        element: <IndividualTransferRequestDetails />,
      },
    ],
  },
];

export const router = createBrowserRouter(AppRoutes);
