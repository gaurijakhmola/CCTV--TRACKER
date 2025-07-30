const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const stations = require('./stationsData');

const JWT_SECRET = 'your_very_strong_secret_here'; // For production: change this to a real secret!

const app = express();
app.use(cors());
app.use(express.json());

// --- 20 station heads + 1 employee example ---
const users = [
  { id: 1,  username: 'head_1',  passwordHash: bcrypt.hashSync('password1', 8),  finalPasswordHash: null, registered: false, role: 'head', assignedStationId: 1 },
  { id: 2,  username: 'head_2',  passwordHash: bcrypt.hashSync('password2', 8),  finalPasswordHash: null, registered: false, role: 'head', assignedStationId: 2 },
  { id: 3,  username: 'head_3',  passwordHash: bcrypt.hashSync('password3', 8),  finalPasswordHash: null, registered: false, role: 'head', assignedStationId: 3 },
  { id: 4,  username: 'head_4',  passwordHash: bcrypt.hashSync('password4', 8),  finalPasswordHash: null, registered: false, role: 'head', assignedStationId: 4 },
  { id: 5,  username: 'head_5',  passwordHash: bcrypt.hashSync('password5', 8),  finalPasswordHash: null, registered: false, role: 'head', assignedStationId: 5 },
  { id: 6,  username: 'head_6',  passwordHash: bcrypt.hashSync('password6', 8),  finalPasswordHash: null, registered: false, role: 'head', assignedStationId: 6 },
  { id: 7,  username: 'head_7',  passwordHash: bcrypt.hashSync('password7', 8),  finalPasswordHash: null, registered: false, role: 'head', assignedStationId: 7 },
  { id: 8,  username: 'head_8',  passwordHash: bcrypt.hashSync('password8', 8),  finalPasswordHash: null, registered: false, role: 'head', assignedStationId: 8 },
  { id: 9,  username: 'head_9',  passwordHash: bcrypt.hashSync('password9', 8),  finalPasswordHash: null, registered: false, role: 'head', assignedStationId: 9 },
  { id: 10, username: 'head_10', passwordHash: bcrypt.hashSync('password10', 8), finalPasswordHash: null, registered: false, role: 'head', assignedStationId: 10 },
  { id: 11, username: 'head_11', passwordHash: bcrypt.hashSync('password11', 8), finalPasswordHash: null, registered: false, role: 'head', assignedStationId: 11 },
  { id: 12, username: 'head_12', passwordHash: bcrypt.hashSync('password12', 8), finalPasswordHash: null, registered: false, role: 'head', assignedStationId: 12 },
  { id: 13, username: 'head_13', passwordHash: bcrypt.hashSync('password13', 8), finalPasswordHash: null, registered: false, role: 'head', assignedStationId: 13 },
  { id: 14, username: 'head_14', passwordHash: bcrypt.hashSync('password14', 8), finalPasswordHash: null, registered: false, role: 'head', assignedStationId: 14 },
  { id: 15, username: 'head_15', passwordHash: bcrypt.hashSync('password15', 8), finalPasswordHash: null, registered: false, role: 'head', assignedStationId: 15 },
  { id: 16, username: 'head_16', passwordHash: bcrypt.hashSync('password16', 8), finalPasswordHash: null, registered: false, role: 'head', assignedStationId: 16 },
  { id: 17, username: 'head_17', passwordHash: bcrypt.hashSync('password17', 8), finalPasswordHash: null, registered: false, role: 'head', assignedStationId: 17 },
  { id: 18, username: 'head_18', passwordHash: bcrypt.hashSync('password18', 8), finalPasswordHash: null, registered: false, role: 'head', assignedStationId: 18 },
  { id: 19, username: 'head_19', passwordHash: bcrypt.hashSync('password19', 8), finalPasswordHash: null, registered: false, role: 'head', assignedStationId: 19 },
  { id: 20, username: 'head_20', passwordHash: bcrypt.hashSync('password20', 8), finalPasswordHash: null, registered: false, role: 'head', assignedStationId: 20 },
  // Example employee (add more if you want)
  { id: 21, username: 'tciluser', passwordHash: bcrypt.hashSync('employee123', 8), finalPasswordHash: null, registered: true, role: 'employee' }
];

// In-memory data stores (replace with database in production)
let cameraData = {};
let complaints = [];
let complaintResponses = [];
let complaintIdCounter = 1;
let responseIdCounter = 1;

// Initialize camera data for all stations
stations.forEach(station => {
  cameraData[station.id] = {
    pending: Math.floor(Math.random() * 20) + 5, // Random initial data
    installed: Math.floor(Math.random() * 50) + 10
  };
});

// --- JWT middleware ---
function authenticateJWT(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'No token provided' });
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
}

// --- Prelogin endpoint (check registration needed) ---
app.post('/api/prelogin', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username);

  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  if (user.role !== 'head') return res.json({ needSecret: false }); // Employee

  if (user.registered) {
    return res.json({ needSecret: false });
  }
  if (bcrypt.compareSync(password, user.passwordHash)) {
    return res.json({ needSecret: true });
  }
  return res.status(401).json({ error: 'Invalid credentials' });
});

// --- Station head registration endpoint (only for heads, only once) ---
app.post('/api/secret-register', (req, res) => {
  const { username, password, secret } = req.body;
  const user = users.find(u => u.username === username);

  if (!user || user.registered || user.role !== 'head')
    return res.status(400).json({ error: 'Registration not allowed!' });
  if (!secret) return res.status(400).json({ error: 'Secret code required' });

  if (bcrypt.compareSync(password, user.passwordHash)) {
    user.finalPasswordHash = bcrypt.hashSync(password + secret, 8);
    user.registered = true;
    return res.json({ success: true });
  }
  return res.status(401).json({ error: 'Invalid credentials' });
});

// --- LOGIN endpoint --- UPDATED LOGIC
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username);
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });

  if (user.role === 'employee') {
    // EMPLOYEES: always check original hash
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });
    const payload = { username: user.username, role: user.role };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '6h' });
    return res.json({ token });
  } else if (user.role === 'head') {
    // HEADS: only after registration use final hash
    if (!user.registered) {
      return res.status(403).json({ error: 'Not registered. Register with secret code.' });
    }
    if (!user.finalPasswordHash) {
      return res.status(401).json({ error: 'Final password not set!' });
    }
    const valid = await bcrypt.compare(password, user.finalPasswordHash);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });
    const payload = {
      username: user.username,
      role: user.role,
      assignedStationId: user.assignedStationId
    };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '6h' });
    return res.json({ token });
  } else {
    return res.status(401).json({ error: 'Unknown role' });
  }
});

// --- Get stations (example protected endpoint) ---
app.get('/api/stations', authenticateJWT, (req, res) => {
  const user = req.user;
  if (user.role === 'head') {
    const station = stations.find(s => s.id === user.assignedStationId);
    if (!station) return res.status(404).json({ error: 'Assigned station not found' });
    return res.json([station]);
  }
  res.json(stations);
});

// --- NEW ENDPOINTS FOR DASHBOARD FUNCTIONALITY ---

// Get camera data for a specific station
app.get('/api/camera-data/:stationId', authenticateJWT, (req, res) => {
  const stationId = parseInt(req.params.stationId);
  const user = req.user;
  
  // Station heads can only access their assigned station
  if (user.role === 'head' && user.assignedStationId !== stationId) {
    return res.status(403).json({ error: 'Access denied' });
  }
  
  const data = cameraData[stationId] || { pending: 0, installed: 0 };
  res.json(data);
});

// Update camera data (Station heads only)
app.post('/api/update-cameras', authenticateJWT, (req, res) => {
  const { stationId, pending, installed } = req.body;
  const user = req.user;
  
  if (user.role !== 'head') {
    return res.status(403).json({ error: 'Only station heads can update camera data' });
  }
  
  if (user.assignedStationId !== stationId) {
    return res.status(403).json({ error: 'Can only update your assigned station' });
  }
  
  cameraData[stationId] = { pending, installed };
  res.json({ success: true });
});

// Create new complaint (Station heads only)
app.post('/api/complaints', authenticateJWT, (req, res) => {
  const { title, description, priority } = req.body;
  const user = req.user;
  
  if (user.role !== 'head') {
    return res.status(403).json({ error: 'Only station heads can create complaints' });
  }
  
  const newComplaint = {
    id: complaintIdCounter++,
    title,
    description,
    priority,
    status: 'pending',
    stationId: user.assignedStationId,
    stationHeadUsername: user.username,
    createdAt: new Date().toISOString(),
    responses: []
  };
  
  complaints.push(newComplaint);
  res.json({ success: true, complaint: newComplaint });
});

// Get complaints for station head (their station only)
app.get('/api/complaints', authenticateJWT, (req, res) => {
  const user = req.user;
  
  if (user.role !== 'head') {
    return res.status(403).json({ error: 'Only station heads can access this endpoint' });
  }
  
  const stationComplaints = complaints
    .filter(c => c.stationId === user.assignedStationId)
    .map(complaint => ({
      ...complaint,
      responses: complaintResponses.filter(r => r.complaintId === complaint.id)
    }));
  
  res.json(stationComplaints);
});

// Get all complaints for employees
app.get('/api/all-complaints', authenticateJWT, (req, res) => {
  const user = req.user;
  
  if (user.role !== 'employee') {
    return res.status(403).json({ error: 'Only employees can access this endpoint' });
  }
  
  const allComplaints = complaints.map(complaint => {
    const station = stations.find(s => s.id === complaint.stationId);
    return {
      ...complaint,
      stationName: station ? station.name : null,
      responses: complaintResponses.filter(r => r.complaintId === complaint.id)
    };
  });
  
  res.json(allComplaints);
});

// Send response to complaint (Employees only)
app.post('/api/complaint-response', authenticateJWT, (req, res) => {
  const { complaintId, message, status } = req.body;
  const user = req.user;
  
  if (user.role !== 'employee') {
    return res.status(403).json({ error: 'Only employees can send responses' });
  }
  
  const complaint = complaints.find(c => c.id === complaintId);
  if (!complaint) {
    return res.status(404).json({ error: 'Complaint not found' });
  }
  
  const newResponse = {
    id: responseIdCounter++,
    complaintId,
    message,
    employeeUsername: user.username,
    status: 'pending', // pending approval from station head
    createdAt: new Date().toISOString()
  };
  
  complaintResponses.push(newResponse);
  
  // Update complaint status if it's being marked as resolved
  if (status === 'resolved') {
    complaint.status = 'processing'; // Still needs station head approval
  } else if (status === 'processing') {
    complaint.status = 'processing';
  }
  
  res.json({ success: true, response: newResponse });
});

// Approve or decline employee response (Station heads only)
app.post('/api/complaint-approval', authenticateJWT, (req, res) => {
  const { complaintId, responseId, action } = req.body; // action: 'approve' or 'decline'
  const user = req.user;
  
  if (user.role !== 'head') {
    return res.status(403).json({ error: 'Only station heads can approve responses' });
  }
  
  const complaint = complaints.find(c => c.id === complaintId);
  if (!complaint) {
    return res.status(404).json({ error: 'Complaint not found' });
  }
  
  if (complaint.stationId !== user.assignedStationId) {
    return res.status(403).json({ error: 'Can only approve responses for your station' });
  }
  
  const response = complaintResponses.find(r => r.id === responseId);
  if (!response) {
    return res.status(404).json({ error: 'Response not found' });
  }
  
  response.status = action === 'approve' ? 'approved' : 'declined';
  
  // If approved and was marked for resolution, update complaint status
  if (action === 'approve' && complaint.status === 'processing') {
    complaint.status = 'resolved';
  }
  
  res.json({ success: true });
});

// --- Example dummy endpoints (kept for compatibility) ---
app.post('/api/request-complaint-status', authenticateJWT, (req, res) => { res.json({ status: "pending" }); });
app.post('/api/confirm-complaint-status-change', authenticateJWT, (req, res) => { res.json({ success: true }); });
app.post('/api/approve-resolve', authenticateJWT, (req, res) => { res.json({ success: true }); });
app.post('/api/send-message', authenticateJWT, (req, res) => { res.json({ success: true }); });

// --- Server start ---
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Sample data initialized:');
  console.log(`- ${stations.length} stations`);
  console.log(`- ${users.length} users (${users.filter(u => u.role === 'head').length} station heads, ${users.filter(u => u.role === 'employee').length} employees)`);
  console.log('- Camera data initialized for all stations');
  console.log('\nTest credentials:');
  console.log('Station Head: head_1 (register first with password1 + secret, then login with password1+secret)');
  console.log('Employee: tciluser / employee123');
});