const express = require('express');
const cors = require('cors');
const axios = require('axios');
const db = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

const WEBHOOK_URL = "https://webhook.site/a35993cd-25bc-4da2-aa9a-e2b55dc8cb8a"; // Get one from webhook.site

// 1. Create Job
app.post('/api/jobs', (req, res) => {
  const { taskName, payload, priority } = req.body;
  const query = `INSERT INTO jobs (taskName, payload, priority, status) VALUES (?, ?, ?, 'pending')`;
  db.run(query, [taskName, JSON.stringify(payload), priority], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID, message: "Job Created" });
  });
});

// 2. List Jobs (with filters)
app.get('/api/jobs', (req, res) => {
  const { status, priority } = req.query;
  let query = "SELECT * FROM jobs WHERE 1=1";
  let params = [];

  if (status) { query += " AND status = ?"; params.push(status); }
  if (priority) { query += " AND priority = ?"; params.push(priority); }

  db.all(query, params, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// 3. Get Job Detail
app.get('/api/jobs/:id', (req, res) => {
  db.get("SELECT * FROM jobs WHERE id = ?", [req.params.id], (err, row) => {
    if (err || !row) return res.status(404).json({ error: "Not found" });
    res.json(row);
  });
});

// 4. Run Job (Simulation)
app.post('/api/jobs/:id/run', (req, res) => {
  const jobId = req.params.id;

  // Set to running
  db.run("UPDATE jobs SET status = 'running' WHERE id = ?", [jobId], () => {
    
    // Simulate background work (3 seconds)
    setTimeout(() => {
      db.run("UPDATE jobs SET status = 'completed' WHERE id = ?", [jobId], async () => {
        
        // Fetch job for Webhook
        db.get("SELECT * FROM jobs WHERE id = ?", [jobId], async (err, job) => {
          console.log(`Job ${jobId} completed. Sending webhook...`);
          try {
            await axios.post(WEBHOOK_URL, { 
              jobId: job.id, 
              taskName: job.taskName, 
              status: 'completed',
              payload: JSON.parse(job.payload)
            });
          } catch (e) { console.error("Webhook failed"); }
        });

      });
    }, 3000);

    res.json({ message: "Job started..." });
  });
});

app.listen(5000, () => console.log("Backend running on port 5000"));