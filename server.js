const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
const port = 5000;
app.use('/uploads', express.static('uploads'));

const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
destination: function (req, file, cb) {
cb(null, 'uploads/'); // ensure this folder exists
},
filename: function (req, file, cb) {
cb(null, Date.now() + '-' + file.originalname);
}
});

const upload = multer({ storage });

app.use(cors());
app.use(express.urlencoded({ extended: true })); // for form submissions
app.use(express.json());
app.use(express.static('public')); // to serve HTML/CSS from public folder

// DB connection
const db = mysql.createConnection({
host: 'localhost',
user: 'root',
password: 'varshini17', // make sure this matches your MySQL setup
database: 'project_db'
});

db.connect(err => {
if (err) {
console.error('DB connection error:', err.stack);
return;
}
console.log('Connected to DB.');
});

// Home route (can serve index.html)
app.get('/', (req, res) => {
res.sendFile(__dirname + '/public/index.html');
});

// Add Project Route
app.post('/add-project', upload.fields([
  { name: 'uploadProof', maxCount: 1 },
  { name: 'uploadCertificate', maxCount: 1 }
]), (req, res) => {
  const {
    title, year, role, otherRole, projectType,
    duration, amount, agency, status,
    amountReleased, amountSpent
  } = req.body;

  const uploadProof = req.files?.uploadProof?.[0]?.filename || null;
  const uploadCertificate = req.files?.uploadCertificate?.[0]?.filename || null;

  console.log('Form body:', req.body); // ✅ Should now show all values
  console.log('Files:', req.files);    // ✅ Should show uploaded files

  const sql = `INSERT INTO projects (
    title, year
, role, otherRole, projectType, duration, amount,
    agency, status, uploadProof, amountReleased, amountSpent, uploadCertificate
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  db.query(sql, [
    title, year, role, otherRole, projectType, duration, amount,
    agency, status, uploadProof, amountReleased, amountSpent, uploadCertificate
  ], (err, result) => {
    if (err) {
      console.error('Failed to insert project:', err);
      return res.status(500).send('Failed to add project: ' + err.message);
    }
    res.send(`
      <html>
        <head>
          <title>Success</title>
          <style>
            body {
              font-family: 'Segoe UI', sans-serif;
              background-color: #e8f5e9;
              text-align: center;
              padding: 5rem;
            }
            .message {
              background: white;
              padding: 2rem;
              border-radius: 12px;
              box-shadow: 0 4px 12px rgba(0,0,0,0.1);
              display: inline-block;
            }
            a {
              display: block;
              margin-top: 1rem;
              text-decoration: none;
              color: #0288d1;
            }
          </style>
        </head>
        <body>
          <div class="message">
            <h2>✅ Project added successfully!</h2>
            <a href="/">Back to Home</a>
            <a href="/form.html">Add Another Project</a>
          </div>
        </body>
      </html>
    `);    
  });
});


app.get('/view-projects', (req, res) => {
  db.query('SELECT * FROM projects', (err, results) => {
  if (err) return res.status(500).send('Database error');
  res.render('view-projects', { projects: results });
  });
  });


// Get all projects
app.get('/projects', (req, res) => {
db.query('SELECT * FROM projects', (err, results) => {
if (err) {
console.error('Error fetching projects:', err);
return res.status(500).send('Error retrieving projects');
}
res.json(results);
});
});

/// Get project by ID
app.get('/projects/:id', (req, res) => {
  const id = req.params.id;
  console.log('GET request for project ID:', id);
  db.query('SELECT * FROM projects WHERE id = ?', [id], (err, results) => {
  if (err) {
  console.error('Error fetching project:', err);
  return res.status(500).json({ error: 'Database error' });
  }
  if (results.length === 0) {
  return res.status(404).json({ error: 'Project not found' });
  }
  res.json(results[0]);
  });
  });
  


  // Update project by ID
app.put('/projects/:id', upload.fields([
  { name: 'uploadProof', maxCount: 1 },
  { name: 'uploadCertificate', maxCount: 1 }
]), (req, res) => {
  const id = req.params.id;

  // Retrieve body data
  const {
    title, year, role, otherRole, projectType,
    duration, amount, agency, status,
    amountReleased, amountSpent
  } = req.body;

  // Uploaded files (if any)
  const uploadProof = req.files?.uploadProof?.[0]?.filename || null;
  const uploadCertificate = req.files?.uploadCertificate?.[0]?.filename || null;

  const updateSql = `
    UPDATE projects
    SET title = ?, year = ?, role = ?, otherRole = ?, projectType = ?, duration = ?,
        amount = ?, agency = ?, status = ?,
        uploadProof = COALESCE(?, uploadProof),
        amountReleased = ?, amountSpent = ?,
        uploadCertificate = COALESCE(?, uploadCertificate)
    WHERE id = ?
  `;

  db.query(updateSql, [
    title, year, role, otherRole, projectType, duration, amount,
    agency, status, uploadProof, amountReleased, amountSpent,
    uploadCertificate, id
  ], (err, result) => {
    if (err) {
      console.error('Error updating project:', err);
      return res.status(500).json({ error: 'Update failed' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json({ message: 'Project updated successfully' });
  });
});




// Server start
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
