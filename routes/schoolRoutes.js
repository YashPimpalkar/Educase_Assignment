import express from 'express';
import { addSchoolController, listSchoolsController } from '../controller/schoolController.js';


const router = express.Router();

// Route for adding a new school
router.post('/addSchool', addSchoolController);

// Route for listing schools by proximity
router.get('/listSchools', listSchoolsController);

export default router;
