import { Router } from 'express';

import * as placeController from 'controllers/place';
import * as userController from 'controllers/user';
import * as adminOnRestController from 'controllers/adminOnRest';
import {
  createAuthMiddleware,
} from 'helpers/session';
import {
  USER_ROLE_ADMIN,
} from 'models/user';

const router = new Router();

// debug middleware
router.use( ( req, res, next ) => {
  // console.log('req.protocol');
  // console.log(req.protocol);

  // console.log('req.host');
  // console.log(req.host);

  // console.log('req.path');
  // console.log(req.path);
  // console.log('req.originalUrl');
  // console.log(req.originalUrl);

  // console.log('req.headers');
  // console.log(JSON.stringify(req.headers));

  // console.log('req.get(\'host\')');
  // console.log(req.get('host'));

  next();
});

/*
  `admin-on-rest` endpoints
*/
adminOnRestController.addRoutes(router);

const adminOnly = createAuthMiddleware({
  requiredRoles: [ USER_ROLE_ADMIN ],
});
// CRUD USER
router.use('/api/users', adminOnly);
router.post('/api/users', userController.create );
router.patch('/api/users/:id', userController.update );
router.put('/api/users/:id', userController.update );
router.get('/api/users/:id', userController.get );
router.get('/api/users', userController.list );
router.delete('/api/users/:id', userController.remove );

// CRUD PLACE
router.use('/api/places', adminOnly);
router.post('/api/places', placeController.create );
router.patch('/api/places/:id', placeController.update );
router.put('/api/places/:id', placeController.update );
router.get('/api/places/:id', placeController.get );
router.get('/api/places', placeController.list );
router.delete('/api/places/:id', placeController.remove );

// Public user APIs
router.post('/api/signup', userController.signup);
router.post('/api/login', userController.login);
router.get('/api/logout', userController.logout);
router.get('/api/session/info', userController.sessionInfo);
router.get('/api/verify-email', userController.verifyEmail);
router.post('/api/lost-password', userController.lostPassword);
router.post('/api/reset-password', userController.resetPassword);


export default router;
