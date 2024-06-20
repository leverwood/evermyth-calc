import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "./App.scss";

import OldApp from "./0.2/components/App-0.2";
import SystemOverview from "./0.3/components/SystemOverview";
import RewardCreator from "./rewards/components/RewardCreator";
import PlayerTracker from "./players/components/PlayerTracker";
import ShopList from "./shops/components/ShopList";
import Layout from "./Layout";
import { ShopProvider } from "./shops/contexts/ShopContext";
import EditShop from "./shops/components/EditShop";
import Map from "./map/components/Map";

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
  {
    path: "/shop",
    element: (
      <Layout>
        <ShopProvider>
          <ShopList />
        </ShopProvider>
      </Layout>
    ),
  },
  {
    path: "/shop/:id/edit",
    element: (
      <Layout>
        <ShopProvider>
          <EditShop />
        </ShopProvider>
      </Layout>
    ),
  },
  {
    path: "/shop/add",
    element: (
      <Layout>
        <ShopProvider>
          <EditShop />
        </ShopProvider>
      </Layout>
    ),
  },
  {
    path: "/map",
    element: (
      <Layout>
        <Map />
      </Layout>
    ),
  },
]);


const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
