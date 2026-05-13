const mongoose = require('mongoose');

const promoCodeSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    uppercase: true
  },
  coins: {
    type: Number,
    required: true
  },
  maxUses: {
    type: Number,
    required: true
  },
  currentUses: {
    type: Number,
    default: 0
  },
  expiresAt: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const PromoCode = mongoose.model('PromoCode', promoCodeSchema);

module.exports = PromoCode;
