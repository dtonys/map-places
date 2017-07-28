import { Router } from 'express';

import * as apiController from 'api-controller';

const router = new Router();

router.get('/user', apiController.loadUser );
router.get('/page', apiController.loadPageData );

// Places
router.get('/page', apiController.loadPageData );

router.get('/places', apiController.getPlacesList );
router.post('/places', apiController.createPlace );
router.patch('/places/:id', apiController.patchPlace );
router.get('/places/:id', apiController.getPlace );
router.delete('/places/:id', apiController.deletePlace );

export default router;
