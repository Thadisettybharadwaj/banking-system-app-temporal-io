import ReactDOM from 'react-dom/client';
import './index.css';
import { RouterProvider } from 'react-router-dom';
import { router } from './router/Router';

const container = document.getElementById('root');

// Create a root instance
const root = ReactDOM.createRoot(container!);

// Render the app using the root
root.render(<RouterProvider router={router} />);
