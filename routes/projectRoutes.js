const express = require('express');
const router = express.Router();
const projectController = require('../Controllers/projectController');

router.post('/projects', projectController.createProject);
router.get('/projects', projectController.getAllProjects);
router.get('/:id', (req, res) => {
    const id = req.params.id;
  
    db.query('SELECT * FROM projects WHERE id = ?', [id], (err, result) => {
      if (err) {
        console.error('Error fetching project by ID:', err);
        return res.status(500).json({ error: 'Database error' });
      }
  
      if (result.length === 0) {
        return res.status(404).json({ error: 'Project not found' });
      }
  
      res.json(result[0]);
    });
  });
  

module.exports = router;
