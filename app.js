const mongoose = require('mongoose');
const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');

// Connect to MongoDB
const url = 'mongodb+srv://GK:gopikrishna123@cluster0.xwia3ec.mongodb.net/CaseStudyNew?retryWrites=true&w=majority';


mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to MongoDB Atlas');
  })
  .catch((error) => {
    console.error('MongoDB Atlas connection error:', error);
  });

// Define employee schema
const employeeSchema = new mongoose.Schema({
  name: String,
  location: String,
  position: String,
  salary: Number
});

// Create employee model
const Employee = mongoose.model('Employee', employeeSchema);

// Serve static files
app.use(express.static(path.join(__dirname, '/dist/FrontEnd')));

// Parse incoming requests
app.use(bodyParser.json());


// TODO: Get data from db using api '/api/employeelist'
app.get('/api/employeelist', (req, res) => {
  // Fetch all employees from the database
  Employee.find()
    .then((employees) => {
      res.status(200).json(employees);
    })
    .catch((error) => {
      res.status(500).json({ error: 'Failed to fetch employees' });
    });
});

// TODO: Get single data from db using api '/api/employeelist/:id'
app.get('/api/employeelist/:id', (req, res) => {
  // Fetch a single employee by id from the database
  Employee.findById(req.params.id)
    .then((employee) => {
      if (employee) {
        res.status(200).json(employee);
      } else {
        res.status(404).json({ error: 'Employee not found' });
      }
    })
    .catch((error) => {
      res.status(500).json({ error: 'Failed to fetch employee' });
    });
});


// Save data to db using api '/api/employeelist'
app.post('/api/employeelist', async (req, res) => {
  console.log(req.body);
  // Create a new employee object from the request body
 const newEmployee =  new Employee({
    name: req.body.name,
    location: req.body.location,
    position: req.body.position,
    salary: req.body.salary
  });

  // Save the new employee to the database
  await newEmployee.save()
    .then(() => {
      res.status(200).json({ message: 'Employee saved successfully' });
    })
    .catch((error) => {
      res.status(500).json({ error: 'Failed to save employee' });
    });
});




// TODO: Delete an employee data from db using api '/api/employeelist/:id'
app.delete('/api/employeelist/:id', (req, res) => {
  // Delete an employee by id from the database
  Employee.findByIdAndRemove(req.params.id)
    .then((employee) => {
      if (employee) {
        res.status(200).json({ message: 'Employee deleted successfully' });
      } else {
        res.status(404).json({ error: 'Employee not found' });
      }
    })
    .catch((error) => {
      res.status(500).json({ error: 'Failed to delete employee' });
    });
});





// TODO: Update an employee data in the database using the API '/api/employeelist/:id'
// Request body format: {name:'', location:'', position:'', salary:''}






app.put('/api/employeelist' , async (req, res) => {
  console.log(req.body);
  const updateFields = {
    name: req.body.name,
    location: req.body.location,
    position: req.body.position,
    salary: req.body.salary
  };

 await  Employee.findByIdAndUpdate(req.body._id, { $set: updateFields }, { new: true })
    .then((employee) => {
      if (employee) {
        res.status(200).json(employee);
      } else {
        res.status(404).json({ error: 'Employee not found' });
      }
    })
    .catch((error) => {
      res.status(500).json({ error: 'Failed to update employee' });
    });
});





// Serve the frontend
app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, '/dist/FrontEnd/index.html'));
});

// Start the server
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
