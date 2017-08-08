// Using `next-routes` allows us map a url to a page, outside of the default page handling.
import nextRoutes from 'next-routes';

const routes = nextRoutes();

// routes
//   // NOTE: Route label cannot include "/"
//   // .add( [route-label], [route-url], [page-name]);
//   .add( 'plot-places', '/admin/plot-places', 'plot-places');

export default routes;
