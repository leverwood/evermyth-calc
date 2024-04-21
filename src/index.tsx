import React from 'react';
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import OldApp from './0.2/components/App-0.2';
import NewSystem from './0.3/components/NewSystem';
import RewardCreatorNew from './0.3/components/RewardCreatorNew';
import reportWebVitals from './reportWebVitals';

const router = createBrowserRouter([
  {
    path: "/0.2",
    element: <OldApp />,
  },
  {
    path: "/",
    element: <NewSystem />,
  },
  {
    path: "/rewards",
    element: <RewardCreatorNew />,
  }
]);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
