import { Routes, Route, Navigate } from "react-router-dom"

import BlankLayout from "./layouts/BlankLayout";
import BaseLayout from "./layouts/BaseLayout";
import HeaderLayout from "./layouts/HeaderLayout";

import Article from './views/article';
import Suite from './views/suite';

import Login from './views/shared/login';
import Page401 from './views/shared/401';
import Page505 from './views/shared/505';
import Page404 from './views/shared/404';

function AppRoute() {
    return (
        <Routes>
          <Route path="/" element={<HeaderLayout />}>
            <Route index element={<Suite />} />
            <Route path="suite" element={<Suite />} />
            <Route path="suite/:id" element={<Suite />} />
            <Route path="suite/:id/edit" element={<Suite editing={true} />} />
            <Route path="article" element={<Article />} />
            <Route path="article/:id" element={<Article />} />
            <Route path="article/:id/edit" element={<Article editing={true} />} />
          </Route>
          <Route path="/shared" element={<BaseLayout />}>
            <Route index element={<Page404 />} />
            <Route path="401" element={<Page401 />} />
            <Route path="505" element={<Page505 />} />
            <Route path="404" element={<Page404 />} />
          </Route>
          <Route path="/shared/login" element={<BlankLayout />}>
            <Route index element={<Login />} />
          </Route>
          <Route path="*" element={<Navigate to="/shared/404" replace={true} />} />
        </Routes>
    )
  }

export default AppRoute