const express = require('express');
const connectDB = require('./config/db');
//Za chat
const cors = require('cors');
const Message = require('./models/Message');
const socket = require('socket.io');
const path = require('path');
const app = express();

//Spajanje u databazu
connectDB();

//Middleware za parsiranje podataka
app.use(express.json({ extended: false }));

//Definiranje Routesa
//Middleware za profile pictures
app.use('/uploads', express.static('uploads'));
//Middleware za dodavanje api/users na sve routeove za usere
app.use('/api/users', require('./routes/api/users'));

//Middleware za search
app.use('/api/search', require('./routes/api/search'));

//Middleware za dodavanje api/auth na sve routeove za authentikaciju
app.use('/api/auth', require('./routes/api/auth'));

//Middleware za dodavanje api/users na sve routeove za profil
app.use('/api/profile', require('./routes/api/profile'));

//Middleware za dodavanje api/users na sve routeove za postove
app.use('/api/posts', require('./routes/api/posts'));

//Port varijabla koja trazi dali je vec setana, ako ne uzme 5000 kao default
const PORT = process.env.PORT || 5000;

//Kod za chat
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Headers', 'Content-type');
  res.header('Access-Control-Allow-Methods', 'GET, POST');
  next();
});

app.use(
  cors({
    credentials: true,
    origin: 'https://stormy-plains-14937.herokuapp.com'
  })
);
//Dohvaća sve poruke
app.get('/api/message', (req, res) => {
  Message.find({}).exec((err, messages) => {
    if (err) {
      res.send(err).status(500);
    } else {
      res.send(messages).status(200);
    }
  });
});

// Stvara novu poruku
app.post('/api/message', (req, res) => {
  Message.create(req.body)
    .then(message => {
      res.send(message).status(200);
    })
    .catch(err => {
      console.log(err);
      res.send(err).status(500);
    });
});

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

const server = app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
});

const io = socket(server);
const nsp = io.of('/chatty');
nsp.on('connection', socket => {
  console.log('connected...socket', socket.id);
  socket.on('new-message', data => {
    nsp.emit('new-message', data);
  });
});
