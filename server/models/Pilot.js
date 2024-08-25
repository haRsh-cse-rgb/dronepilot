const mongoose = require('mongoose');

const PilotSchema = new mongoose.Schema({
  name: String,
  profileImage: String,
  experience: Number,
  location: String,
  coordinates: {
    type: [Number], 
    index: '2dsphere'
  }
});

module.exports = mongoose.model('Pilot', PilotSchema);
