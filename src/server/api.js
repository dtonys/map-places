import { Router } from 'express';

import * as placeController from 'controllers/place';
import * as userController from 'controllers/user';

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

// CRUD USER
router.post('/api/users', userController.create );
router.patch('/api/users/:id', userController.update );
router.put('/api/users/:id', userController.update );
router.get('/api/users/:id', userController.get );
router.get('/api/users', userController.list );
router.delete('/api/users/:id', userController.remove );

// Session
router.post('/api/signup', userController.signup);
router.post('/api/login', userController.login);
router.get('/api/logout', userController.logout);
router.get('/api/session/info', userController.sessionInfo);
router.get('/api/verify-email', userController.verifyEmail);
router.post('/api/lost-password', userController.lostPassword);
router.post('/api/reset-password', userController.resetPassword);

// CRUD PLACE
router.post('/api/places', placeController.create );
router.patch('/api/places/:id', placeController.update );
router.put('/api/places/:id', placeController.update );
router.get('/api/places/:id', placeController.get );
router.get('/api/places', placeController.list );
router.delete('/api/places/:id', placeController.remove );


export default router;
