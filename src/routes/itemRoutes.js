const express = require('express');
const multer = require('multer');
const path = require('path');
const Item = require('../models/Item');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI('AIzaSyCYJBUqoOfs_iUNABivBF3zXQj3Lhfqv9g');

const router = express.Router();

// Multer setup for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// GET /items/new - Show create form
router.get('/new', (req, res) => {
  res.render('create');
});


// POST /items - Create new item
router.post('/', upload.single('image'), (req, res) => {
  const { title, description, type, contactType, contactEmail, lostFoundAt } = req.body;
  const imageUrl = req.file ? req.file.filename : null;

  const newItem = {
    title,
    description,
    type,
    contactType,
    contactEmail: contactType === 'email' ? contactEmail : null,
    imageUrl,
    status: 'open',
    createdAt: new Date(),
    lostFoundAt: new Date(lostFoundAt)
  };

  Item.insert(newItem, (err) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error creating item');
    } else {
      res.redirect('/items');
    }
  });
});


// GET /items - List all open items
router.get('/', async (req, res) => {
  const search = req.query.search;
  let items = [];

  try {
    if (search) {
      // Local search only
      const allItems = await new Promise((resolve, reject) => {
        Item.find({ status: 'open' }, (err, docs) => {
          if (err) reject(err);
          else resolve(docs);
        });
      });
      items = allItems.filter(item =>
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.description.toLowerCase().includes(search.toLowerCase())
      );
      // Return JSON for search
      res.json(items);
    } else {
      // No search, render page
      items = await new Promise((resolve, reject) => {
        Item.find({ status: 'open' }, (err, docs) => {
          if (err) reject(err);
          else resolve(docs);
        });
      });
      res.render('list', { items });
    }
  } catch (error) {
    console.error('Search error:', error);
    // Fallback
    if (search) {
      const allItems = await new Promise((resolve, reject) => {
        Item.find({ status: 'open' }, (err, docs) => {
          if (err) reject(err);
          else resolve(docs.filter(item =>
            item.title.toLowerCase().includes(search.toLowerCase()) ||
            item.description.toLowerCase().includes(search.toLowerCase())
          ));
        });
      });
      res.json(allItems);
    } else {
      items = await new Promise((resolve, reject) => {
        Item.find({ status: 'open' }, (err, docs) => {
          if (err) reject(err);
          else resolve(docs);
        });
      });
      res.render('list', { items });
    }
  }
});

// POST /items/:id/close - Close an item
router.post('/:id/close', (req, res) => {
  console.log('Closing item', req.params.id);
  Item.update({ _id: req.params.id }, { $set: { status: 'closed' } }, {}, (err, numAffected) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error closing item');
    } else {
      console.log('Updated', numAffected, 'items');
      res.redirect('/items');
    }
  });
});

module.exports = router;