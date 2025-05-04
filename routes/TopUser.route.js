import express from 'express';
import { getTopUser } from '../controllers/TopUser.controller.js';

const Router = express.Router();

Router.route('/users').get(getTopUser);

export default Router;