
import express from 'express';
import getPosts from '../controllers/Postservice.controller.js';
const router = express.Router();

// Route to fetch posts based on type (popular or latest)
router.get('/posts',getPosts);

export default router;
