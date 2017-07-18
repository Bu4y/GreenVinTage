'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Promotion Schema
 */
var PromotionSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Promotion name',
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Promotion', PromotionSchema);
