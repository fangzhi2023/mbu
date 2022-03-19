import { Routes, Route, Navigate } from "react-router-dom"

import Layout from './layouts/components/Layout';

import BlankLayout from "./layouts/BlankLayout";
import BaseLayout from "./layouts/BaseLayout";

import Article from './views/article';
import Suite from './views/suite';

import Login from './views/shared/login';
import Page401 from './views/shared/401';
import Page505 from './views/shared/505';
import Page404 from './views/shared/404';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<BaseLayout />}>
          <Route index element={<Suite />} />
          <Route path="suite" element={<Suite />} />
          <Route path="suite/:id" element={<Suite />} />
          <Route path="suite/:id/edit" element={<Suite editing={true} />} />
          <Route path="article" element={<Article />} />
          <Route path="article/:id" element={<Article />} />
          <Route path="article/:id/edit" element={<Article editing={true} />} />
        </Route>
        <Route path="/shared" element={<BlankLayout />}>
          <Route index element={<Page404 />} />
          <Route path="login" element={<Login />} />
          <Route path="401" element={<Page401 />} />
          <Route path="505" element={<Page505 />} />
          <Route path="404" element={<Page404 />} />
        </Route>
        <Route path="*" element={<Navigate to="/shared/404" replace={true} />} />
      </Routes>
    </Layout>
  );
}

export function RequireAuth({ children }) {
  const authed = true

  return authed === true ? (
    children
  ) : (
    <Navigate to="/shared/401" replace />
  );
}

export default App;
