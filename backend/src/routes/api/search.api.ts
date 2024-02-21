import express from 'express';
const searchController = require('../../controllers/search.controller');

const router = express.Router();
var bodyparser = require('body-parser');
var jsonParser = bodyparser.json();

/**
 * @route GET api/search
 * default search route
 * @returns a list of engineers
 * pageNumber: number, cannot be null
 * limit: number, cannot be null
 * generalSearch: string, cannot be null, only empty string
 * for specialisations and interests, if empty array, means no filter
 */
router.post('/', jsonParser, async (req, res) => {
  const { pageNumber, limit, generalSearch, specialisations, interests } = req.body;

  // parse the pageNumber and limit to number
  const pageNumberInt = parseInt(pageNumber as string);
  const limitInt = parseInt(limit as string);

  const { status, message, totalPages, engineers } = await searchController.search(
    generalSearch,
    specialisations,
    interests,
    pageNumberInt,
    limitInt,
  );
  res.status(status).set('msg', message).set('totalPages', totalPages).send(engineers);
});

/**
 * @route GET api/search/topics
 * get all topics available in the database
 */
router.get('/topics', async (req, res) => {
  const { status, message, topics } = await searchController.getAllTopics();
  res.status(status).set('msg', message).send(topics);
});

export default router;
