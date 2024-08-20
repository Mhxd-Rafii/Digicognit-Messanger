const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = express();

app.use(express.json());
app.use(cors( {
  'origin' : '*',
}));

// Replace with your actual secret key
const ACCESS_TOKEN_SECRET = 'your_jwt_secret_key';

const Message = require('./models/Message');

// JWT Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  console.log('Auth Header:', authHeader); // Debugging line
  console.log('Token:', token); // Debugging line

  if (!token) return res.sendStatus(401); // Unauthorized if no token

  jwt.verify(token, ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403); // Forbidden if token is invalid
    req.user = user;
    next();
  });
};

// Send message
app.post('/api/messages', authenticateToken, async (req, res) => {
  const { recipientId, message, file } = req.body; // Include file if necessary
  const senderId = req.user.userId;

  try {
    const newMessage = new Message({
      sender: senderId,
      recipient: recipientId,
      message,
      file,
    });

    await newMessage.save();
    res.status(201).json(newMessage); // Return the saved message
  } catch (error) {
    res.status(500).json({ message: 'Error sending message', error });
  }
});


// Fetch messages
app.get('/api/messages/:recipientId', authenticateToken, async (req, res) => {
  const senderId = req.user.userId;
  const recipientId = req.params.recipientId;

  try {
    const messages = await Message.find({
      $or: [
        { sender: senderId, recipient: recipientId },
        { sender: recipientId, recipient: senderId },
      ],
    }).sort({ timestamp: 1 });

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching messages', error });
  }
});


mongoose.connect('mongodb://localhost:27017/Digicognit_Messenger')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB...', err));

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
});

const User = mongoose.model('User', userSchema);

// Signup Route
app.post('/api/signup', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Login Route
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || !await bcrypt.compare(password, user.password)) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id }, ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
    res.status(200).json({ message: 'Login successful', token, user });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Users Route
app.get('/users', authenticateToken, async (req, res) => {
  try {
    const users = await User.find({}, { password: 0 }); // Exclude passwords
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));