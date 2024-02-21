import express from 'express';
const testingController = require('../../controllers/testing.controller');

const router = express.Router();
var bodyparser = require('body-parser');
var jsonParser = bodyparser.json();

/*
 * get the usertoken from the user uid
 */
router.get('/usertoken/:id', jsonParser, async (req, res) => {
  const id = req.params.id;
  const { status, message, token } = await testingController.getUserToken(id);
  res.status(status).set('msg', message).send(token);
});

/*
 * change the user claim
 */
router.post('/changeuserclaim', jsonParser, async (req, res) => {
  const { id, userType } = req.body;
  const { status, message } = await testingController.changeUserClaim(id, userType);
  res.status(status).set('msg', message).send();
});

/*
 * test the client side email
 */
router.post('/testingclientemail', jsonParser, async (req, res) => {
  const { id } = req.body;
  const { status, message } = await testingController.testingClientSideEmail(id);
  res.status(status).set('msg', message).send();
});

export default router;
