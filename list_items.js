const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const listSchema = Schema({
  activity: String
});

const List = mongoose.model('item',listSchema);

module.exports = List;
