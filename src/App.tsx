import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "./App.scss";

import OldApp from "./0.2/components/App-0.2";
import SystemOverview from "./0.3/components/SystemOverview";
import RewardCreator from "./rewards/components/RewardList";
import PlayerTracker from "./players/components/PlayerTracker";
import ShopListPage from "./shops/components/ShopList";
import Layout from "./Layout";
import { ShopProvider } from "./shops/contexts/ShopContext";
import EditShop from "./shops/components/EditShop";
import Map from "./map/components/Map";
import RewardPage from "./rewards/components/EditRewardPage";
import { RewardProvider } from "./rewards/contexts/RewardContext";
import ServiceList from "./services/components/ServiceList";
import EditService from "./services/components/EditService";
import { ServiceProvider } from "./services/contexts/ServiceContext";
import EditShopCategory from "./shops/components/EditShopCategory";

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
        <RewardProvider>
          <RewardCreator />
        </RewardProvider>
      </Layout>
    ),
  },
  {
    path: "/rewards/:id/edit",
    element: (
      <Layout>
        <RewardPage />
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
          <ShopListPage />
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
    path: "/shop-categories/:slug/edit",
    element: <EditShopCategory />,
  },
  {
    path: "/shop-categories/add",
    element: <EditShopCategory />,
  },
  {
    path: "/map",
    element: (
      <Layout>
        <Map />
      </Layout>
    ),
  },
  {
    path: "/services",
    element: (
      <Layout>
        <ServiceProvider>
          <ServiceList />
        </ServiceProvider>
      </Layout>
    ),
  },
  {
    path: "/services/:id/edit",
    element: (
      <Layout>
        <ServiceProvider>
          <EditService />
        </ServiceProvider>
      </Layout>
    ),
  },
]);


const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
