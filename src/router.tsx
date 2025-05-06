import { createBrowserRouter } from 'react-router-dom';
import App from './App';


const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },

  
  // Future routes can go here:
  // {
  //   path: '/projects',
  //   element: <ProjectsPage />,
  // },
]);

export default router;
