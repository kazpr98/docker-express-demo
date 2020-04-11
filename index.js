const express = require('express');
const Joi = require('joi');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();

// app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.set('view engine', 'ejs');

const courses = [
  {id:1, name: 'course1'},
  {id:2, name: 'course2'},
  {id:3, name: 'course3'}
]

// Connect to MongoDB
mongoose
  .connect(
    'mongodb://mongo:27017/docker-node-mongo',
    { useNewUrlParser: true }
  )
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

const Item = require('./models/Item');

app.get('/', (req, res) => {
  Item.find()
    .then(items => res.render('index', { items }))
    .catch(err => res.status(404).json({ msg: 'No items found' }));
});

app.get('/api/courses', (req, res) => {
  res.send(courses);
});

app.post('/api/courses', (req,res) => {
  const schema = {
    name: Joi.string().min(3).required()
  }

  const result = Joi.validate(req.body, schema);
  if(result.error) {
    //400 Bad Request
    res.status(400).send(result.error.details[0].message);
    return;
  }

  const course = {
    id: courses.length + 1,
    name: req.body.name
  };
  courses.push(course);
  res.send(course);
});

app.get('/api/courses/:id', (req, res) => {
  const course = courses.find(c => c.id === parseInt(req.params.id));
  if(!course) {
    res.status(404).send('The course was not found');
  }
  res.send(course);
});

// app.get('/api/posts/:year/:month', (req, res) => {
//   res.send(req.params);
// });

//PORT
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});

