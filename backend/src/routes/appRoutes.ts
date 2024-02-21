import { Router } from 'express';

import users from './api/users.api';
import engineers from './api/engineers.api';
import testing from './api/testing.api';
import search from './api/search.api';

const router = Router();

router.use('/users', users);
router.use('/engineers', engineers);
router.use('/testing', testing);
router.use('/search', search);

router.get('/', (req, res) => {
  res.json('Hello World! The server is up and running!');
});

export default router;
