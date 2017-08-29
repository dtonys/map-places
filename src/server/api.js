import { Router } from 'express';

import * as placeController from 'controllers/place';
import * as userController from 'controllers/user';
import * as adminOnRestController from 'controllers/adminOnRest';
import mongoose from 'mongoose';

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

const allCollections = Object.keys(mongoose.connection.collections).join('|');

// GET_LIST /<resource>?sort=['title','ASC']&range=[0, 24]&filter={title:'bar'}
// GET_MANY /<resource>?filter={ids:[123,456,789]}
// GET_MANY_REFERENCE /<resource>?filter={author_id:345}
router.get(`/:resource(${allCollections})`, adminOnRestController.getList );
// GET_ONE /<resource>/<id>
router.get(`/:resource(${allCollections})/:id`, adminOnRestController.getOne );
// CREATE /<resource>/<id>
router.post(`/:resource(${allCollections})`, adminOnRestController.create );
// UPDATE /<resource>/<id>
router.put(`/:resource(${allCollections})/:id`, adminOnRestController.update );
// DELETE /<resource>/<id>
router.delete(`/:resource(${allCollections})/:id`, adminOnRestController._delete );

// [
//   'users',
//   'places',
//   'session',
// ].forEach(( model ) => {
//   router.get(`/${model}`, adminOnRestController.getList );
//   router.get(`/${model}/:id`, adminOnRestController.getOne );
//   router.post(`/${model}/:id`, adminOnRestController.create );
//   router.put(`/${model}/:id`, adminOnRestController.update );
//   router.delete(`/${model}/:id`, adminOnRestController._delete );
// });


// router.get('/users', adminOnRestController.getManyReference );


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
