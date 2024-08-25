// server.js or index.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Pilot = require('./models/Pilot');

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect('mongodb+srv://kumarharshrivastava:undertaker@cluster0.9apki.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', { useNewUrlParser: true, useUnifiedTopology: true });

app.get('/pilots', async (req, res) => {
  try {
    const pilots = await Pilot.find();
    res.json(pilots);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.post('/pilots', async (req, res) => {
  try {
    const pilot = new Pilot(req.body);
    await pilot.save();
    res.status(201).json(pilot);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

app.get('/pilots/match', async (req, res) => {
  const { lat, lng, range, experience } = req.query;
  if (!lat || !lng || !range || !experience) {
    return res.status(400).send('Missing required query parameters.');
  }

  const radius = range / 6371; 

  try {
    const pilots = await Pilot.aggregate([
      {
        $geoNear: {
          near: { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] },
          distanceField: 'distance',
          maxDistance: radius * 6371 * 1000,  
          spherical: true
        }
      },
      { $match: { experience: { $gte: parseInt(experience) } } },
      { $sort: { experience: -1 } },
      { $limit: 10 }
    ]);

    res.json(pilots);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

const port = 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));

