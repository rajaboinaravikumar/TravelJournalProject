const express = require('express');
const router = express.Router();

const journalController = require('../controllers/journalController');
const authMiddleware = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

// Protected routes
router.post(
  '/',
  authMiddleware,
  upload.array('images', 10),
  journalController.createJournal
);

router.get('/user', authMiddleware, journalController.getUserJournals);

router.get('/all', authMiddleware, journalController.getAllJournals);

router.get('/:id', journalController.getJournalById);

router.get('/share/:id', authMiddleware, journalController.shareJournal);

router.delete('/:id', authMiddleware, journalController.deleteJournal);

router.post('/:id/like', authMiddleware, journalController.likeJournal);

router.post('/:id/comment', authMiddleware, journalController.commentJournal);

module.exports = router;
