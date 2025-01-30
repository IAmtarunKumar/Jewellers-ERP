function Db() {
  const mongoose = require("mongoose");

  const dbConnection = process.env.MONGO_URI;
  mongoose.connect(dbConnection, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}
module.exports = Db;
