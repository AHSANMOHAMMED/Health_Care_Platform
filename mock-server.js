const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// In-memory user storage
const users = new Map();

// Register endpoint
app.post('/auth/register', (req, res) => {
  const { email, password, role } = req.body;
  
  console.log('Register request:', { email, role });
  
  // Check if email already exists
  if (users.has(email)) {
    return res.status(400).send('Email already exists');
  }
  
  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).send('Invalid email format');
  }
  
  // Validate password length
  if (!password || password.length < 6) {
    return res.status(400).send('Password must be at least 6 characters');
  }
  
  // Create user
  const user = {
    id: Date.now().toString(),
    email,
    password, // In real app, this would be hashed
    role: role || 'PATIENT',
    firstName: '',
    lastName: ''
  };
  
  users.set(email, user);
  console.log('User registered:', email);
  
  res.status(201).send('User registered successfully');
});

// Login endpoint
app.post('/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  console.log('Login request:', { email });
  
  const user = users.get(email);
  
  if (!user || user.password !== password) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  
  const response = {
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName
    },
    tokens: {
      accessToken: 'mock-jwt-token-' + Date.now(),
      refreshToken: 'mock-refresh-token-' + Date.now()
    }
  };
  
  console.log('Login successful:', email);
  res.json(response);
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', users: users.size });
});

const PORT = 8081;
app.listen(PORT, () => {
  console.log(`✅ Mock Auth Server running on http://localhost:${PORT}`);
  console.log(`📋 Endpoints:`);
  console.log(`   POST http://localhost:${PORT}/auth/register`);
  console.log(`   POST http://localhost:${PORT}/auth/login`);
  console.log(`   GET  http://localhost:${PORT}/health`);
});
