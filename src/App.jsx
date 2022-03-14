import { Routes, Route, Navigate } from "react-router-dom"

import Layout from './layouts/components/Layout';

import BlankLayout from "./layouts/BlankLayout";
import BaseLayout from "./layouts/BaseLayout";

import Document from './views/document';
import Diagram from './views/diagram';

import Login from './views/shared/login';
import Page401 from './views/shared/401';
import Page404 from './views/shared/404';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<BaseLayout />}>
          <Route path="" element={<Diagram />}></Route>
          <Route path="diagram/:id" element={<Diagram />}></Route>
          <Route path="diagram/:id/edit" element={<Diagram status={'editing'} />}></Route>
          <Route path="document/:id" element={<Document />}></Route>
          <Route path="document/:id/edit" element={<Document status={'editing'} />}></Route>
        </Route>
        <Route path="/shared" element={<BlankLayout />}>
          <Route path="login" element={<Login />}></Route>
          <Route path="401" element={<Page401 />} />
          <Route path="404" element={<Page404 />} />
          <Route path="*" element={<Page404 />} />
        </Route>
        <Route path="/*" element={<Navigate to="/shared/404" replace={true} />} />
      </Routes>
    </Layout>
  );
}

export default App;
