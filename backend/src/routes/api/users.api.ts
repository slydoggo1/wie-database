import express from 'express';
const auth = require('../authMiddleware');
const userController = require('../../controllers/users.controller');
const router = express.Router();
var bodyparser = require('body-parser');
var jsonParser = bodyparser.json();

/**
 * Gets all the user feedback
 */
router.get('/user-feedback', auth.adminAuth, async (req, res) => {
  const { status, message, feedback } = await userController.getAllUserFeedback();

  res.status(status).set('msg', message).send(feedback);
});

/**
 * Gets the reset password link for the user
 */
router.post('/forget-password', jsonParser, async (req, res) => {
  const { email } = req.body;
  const { status, message, resetLink } = await userController.sendUserPasswordResetLink(email);
  res.status(status).set('msg', message).send(resetLink);
});

/**
 * Adds a new user to the firestore database
 */
router.post('/signup', jsonParser, async (req, res) => {
  const { uid, firstName, lastName, email, school, role } = req.body;
  const { status, message } = await userController.signup(uid, firstName, lastName, email, school, role);
  res.status(status).set('msg', message).send();
});

/**
 * Creates an admin, adds the admin to the firestore Users collection and sends set password email
 */
router.post('/signup/admin', auth.adminAuth, jsonParser, async (req, res) => {
  const { firstName, lastName, email } = req.body;
  const { status, message } = await userController.signupAdmin(firstName, lastName, email);
  res.status(status).set('msg', message).send();
});

/**
 * Emails the engineer, from contact form.
 */
router.post('/contact', auth.auth, jsonParser, async (req, res) => {
  const { email, yourEmail, name, title, emailMessage } = req.body;
  const { status, message } = await userController.contactEmail(email, yourEmail, name, title, emailMessage);
  res.status(status).set('msg', message).send();
});

/**
 * Emails the engineer, from contact form.
 */
router.post('/contact', auth.auth, jsonParser, async (req, res) => {
  const { email, yourEmail, reason, title, emailMessage } = req.body;
  const { status, message } = await userController.contactEmail(email, yourEmail, reason, title, emailMessage);
  res.status(status).set('msg', message).send();
});

/**
 * get all users admin
 */
router.get('/admin/get-all-users', auth.adminAuth, async (req, res) => {
  const { orderBy, startAfter, limit: limitQuery } = req.query;

  const limit = parseInt(limitQuery as string);

  const { status, message, users, count } = await userController.adminGetAllUsers(orderBy, startAfter, limit);

  res
    .status(status)
    .set('Access-Control-Expose-Headers', ['msg', 'count'])
    .set('msg', message)
    .set('count', count)
    .send(users);
});

/**
 * get the user details by id
 */
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const { status, message, user } = await userController.getUserDetails(id);
  res.status(status).set('msg', message).send(user);
});

/**
 * delete user by id
 */
router.delete('/:uid', auth.adminAuth, async (req, res) => {
  const { uid } = req.params;

  const { status, message } = await userController.deleteUser(uid);
  res.status(status).set('msg', message).send();
});

/**
 * submit user feedback about the website
 */
router.post('/submit-user-feedback', jsonParser, async (req, res) => {
  const { email, feedback, uid, feedbackType, name } = req.body;
  const time = new Date();
  const { status, message } = await userController.createUserFeedback(email, name, feedbackType, feedback, time, uid);

  res.status(status).set('msg', message).send();
});

/**
 * Adds an engineer to the user's favourite list.
 */
router.post('/addFavourite', auth.auth, jsonParser, async (req, res) => {
  const { uid, engineerId } = req.body;
  const { status, message } = await userController.addFavouriteEngineer(uid, engineerId);
  res.status(status).set('msg', message).send();
});

/**
 * Delete an engineer from the user's favourite list.
 */
router.post('/deleteFavourite', auth.auth, jsonParser, async (req, res) => {
  const { uid, engineerId } = req.body;
  const { status, message } = await userController.deleteFavouriteEngineer(uid, engineerId);
  res.status(status).set('msg', message).send();
});

/**
 * Gets the user's favourite engineers.
 */
router.get('/favourites/:id', auth.auth, jsonParser, async (req, res) => {
  const { id } = req.params;
  const { startAfter, limit: limitQuery } = req.query;

  const limit = parseInt(limitQuery as string);

  const { status, message, favourites } = await userController.getFavouriteEngineers(id, startAfter, limit);

  res.status(status).set('msg', message).send(favourites);
});

export default router;
