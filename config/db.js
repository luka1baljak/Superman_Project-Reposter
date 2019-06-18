const mongoose = require('mongoose');
const config = require('config');
const db = config.get('mongoURI');

const connectDB = async () => {
  try {
    //useNewUrlParser da bi se izbjegao deprecation warning
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false
    });

    console.log('MongoDataBase Connected...');
  } catch (err) {
    console.log(err.message);
    //Izlazi iz procesa ako dodje do errora
    process.exit(1);
  }
};

//Eksporta se funkcija te importa u server.js
module.exports = connectDB;
