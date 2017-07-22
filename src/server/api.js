import { Router } from 'express';

import * as apiController from 'api-controller';

const router = new Router();

router.get('/user', apiController.loadUser );
router.get('/page', apiController.loadPageData );

export default router;
