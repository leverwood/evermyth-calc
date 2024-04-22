import { createBrowserRouter, RouterProvider } from "react-router-dom";

import OldApp from "./0.2/components/App-0.2";
import SystemOverview from "./0.3/components/SystemOverview";
import RewardCreator from "./0.3/components/rewards/RewardCreator";
import PlayerTracker from "./0.3/components/players/PlayerTracker";
import Layout from "./Layout";
import "./App.scss";

const router = createBrowserRouter([
  {
    path: "/0.2",
    element: (
      <Layout>
        <OldApp />
      </Layout>
    ),
  },
  {
    path: "/",
    element: (
      <Layout>
        <SystemOverview />
      </Layout>
    ),
  },
  {
    path: "/rewards",
    element: (
      <Layout>
        <RewardCreator />
      </Layout>
    ),
  },
  {
    path: "/players",
    element: (
      <Layout>
        <PlayerTracker />
      </Layout>
    ),
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
