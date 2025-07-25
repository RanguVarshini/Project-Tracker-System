const db = require('../models/db');

// Example to handle form submission (basic)
exports.createProject = (req, res) => {
  const { title, year, role, otherRole, projectType, duration, amount, agency } = req.body;
  
  const query = 'INSERT INTO projects (title, year, role, otherRole, projectType, duration, amount, agency) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
  
  db.query(query, [title, year, role, otherRole, projectType, duration, amount, agency], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send('Database error');
    } else {
      res.status(200).send('Project added successfully');
    }
  });
};

// Fetch All Projects
exports.getAllProjects = (req, res) => {
  db.query('SELECT * FROM projects', (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send('Database error');
    } else {
      res.status(200).json(results);
    }
  });
};
