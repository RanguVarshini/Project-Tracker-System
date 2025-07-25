const mysql = require('mysql2');
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'varshini17',
  database: 'project_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});
connection.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL');
});
module.exports = connection;