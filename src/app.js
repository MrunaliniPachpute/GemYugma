require('dotenv').config();
const express = require('express');
const path = require('path');
const itemRoutes = require('./routes/itemRoutes');
const Item = require('./models/Item');

const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname, '..'))); // Serve files from project root

// Routes
app.use('/items', itemRoutes);



app.get('/', (req, res) => {
  Item.find({ status: 'open' }).sort({ createdAt: -1 }).exec((err, items) => {
    if (err) {
      console.error(err);
      res.render('index', { recentItems: [] });
    } else {
      res.render('index', { recentItems: items.slice(0, 3) });
    }
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
