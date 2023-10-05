// import React from 'react';
// import { Route } from 'react-router';
// import App from './containers/App.jsx';

// const routes = <Route path="/" component={App} />;

// export default routes;

import App from './containers/App';
import Form from './containers/Form';
import Search from './containers/Search';

const routes = [
  {
    path: '/',
    component: App,
  },
  {
    path: '/search',
    component: Search,
  },
  {
    path: '/form',
    component: Form,
  },
];

export default routes;
