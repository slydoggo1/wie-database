import express from 'express';
const auth = require('../authMiddleware');
const engineerController = require('../../controllers/engineers.controller');

const router = express.Router();
var bodyparser = require('body-parser');
var jsonParser = bodyparser.json();

/**
 * get all engineers to review
 */
router.get('/review', auth.adminAuth, async (req, res) => {
  const { status, message, engineers } = await engineerController.getAllEngineersToReview();
  res.status(status).set('msg', message).send(engineers);
});

/**
 * post engineer profile review with feedback
 */
router.post('/review-engineer-feedback', auth.adminAuth, jsonParser, async (req, res) => {
  const { uid, feedback, sections, verified } = req.body;
  const { status, message } = await engineerController.engineerProfileReview(uid, feedback, sections, verified);
  res.status(status).set('msg', message).send();
});

/**
 * sign up engineer
 */
router.post('/signup', jsonParser, async (req, res) => {
  const {
    uid,
    firstName,
    lastName,
    email,
    biography,
    linkedin,
    personalWebsite,
    organisation,
    topics,
    newTopicsDisplayName,
    events,
    position,
    city,
    suburb,
    profilePictureURL,
    introductionVideoURL,
  } = req.body;
  const { status, message } = await engineerController.signup(
    uid,
    firstName,
    lastName,
    email,
    biography,
    linkedin,
    personalWebsite,
    organisation,
    topics,
    newTopicsDisplayName,
    events,
    position,
    city,
    suburb,
    profilePictureURL,
    introductionVideoURL,
  );

  res.status(status).set('msg', message).send();
});

/**
 * get engineer feedback
 */
router.get('/feedback', auth.engineerAuth, async (req, res) => {
  const { uid } = req.query;
  const { status, message, feedback } = await engineerController.getEngineerFeedback(uid as string);

  res.status(status).set('msg', message).send(feedback);
});

/**
 * get all engineers as admin
 */
router.get('/admin/get-all-engineers', auth.adminAuth, async (req, res) => {
  const { orderBy, startAfter, limit: limitQuery } = req.query;

  const limit = parseInt(limitQuery as string);

  const { status, message, engineers, count } = await engineerController.adminGetAllEngineers(
    orderBy,
    startAfter,
    limit,
  );

  res
    .status(status)
    .set('Access-Control-Expose-Headers', ['msg', 'count'])
    .set('msg', message)
    .set('count', count)
    .send(engineers);
});

/**
 * get an engineer by id
 */
router.get('/:id', async (req, res) => {
  const id = req.params.id;
  const { status, message, engineer } = await engineerController.getEngineerByUserId(id);

  res.status(status).set('msg', message).send(engineer);
});

/**
 * delete an engineer by id
 */
router.delete('/:id', auth.adminAuth, async (req, res) => {
  const id = req.params.id;
  const { status, message } = await engineerController.deleteEngineer(id);

  res.status(status).set('msg', message).send();
});

/**
 * edit an engineer by id
 */
router.put('/edit/:id', auth.engineerAuth, jsonParser, async (req, res) => {
  const id = req.params.id;
  const data = req.body;
  const { status, message } = await engineerController.updateEngineer(id, data);

  res.status(status).set('msg', message).send();
});

/**
 * resubmit an engineer profile
 */
router.put('/resubmit/:id', auth.engineerAuth, jsonParser, async (req, res) => {
  const id = req.params.id;
  const data = req.body;
  const { status, message } = await engineerController.resubmitEngineerProfile(id, data);

  res.status(status).set('msg', message).send();
});

export default router;
