import { Router } from 'express';

import * as placeController from 'controllers/place';
import * as userController from 'controllers/user';

const router = new Router();

// USER
router.post('/api/users', userController.create );
router.patch('/api/users/:id', userController.update );
router.put('/api/users/:id', userController.replace );
router.get('/api/users/:id', userController.get );
router.get('/api/users', userController.list );
router.delete('/api/users/:id', userController.remove );

// PLACE
router.post('/api/places', placeController.create );
router.patch('/api/places/:id', placeController.update );
router.put('/api/places/:id', placeController.replace );
router.get('/api/places/:id', placeController.get );
router.get('/api/places', placeController.list );
router.delete('/api/places/:id', placeController.remove );

export default router;
