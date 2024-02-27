import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import Signin from "./pages/Signin.jsx";
import Signup from "./pages/Signup.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Layout from "./Layout.jsx";
import Projects from "./pages/Projects.jsx";
import { Provider } from "react-redux";
import { store, persistor } from "./redux/store.js";
// import {store, persistor} from './redux/store.js';
import { PersistGate } from "redux-persist/integration/react";
import TheamProvider from "./components/TheamProvider.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import OnlyAdminProtectedRoute from "./components/OnlyAdminProtectedRoute.jsx";
import CreatePost from "./pages/CreatePost.jsx";
import UpdatePost from "./pages/UpdatePost.jsx";
import PostPage from "./pages/PostPage.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/sign-in" element={<Signin />} />
      <Route path="/sign-up" element={<Signup />} />
      <Route path="/projects" element={<Projects />} />
      <Route path="/post/:postSlug" element={<PostPage />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
      </Route>
      <Route element={<OnlyAdminProtectedRoute />}>
        <Route path="/create-post" element={<CreatePost />} />
        <Route path="/update-post/:postId" element={<UpdatePost />} />
      </Route>
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <PersistGate persistor={persistor}>
    <Provider store={store}>
      <TheamProvider>
        <RouterProvider router={router} />
      </TheamProvider>
    </Provider>
  </PersistGate>
);
