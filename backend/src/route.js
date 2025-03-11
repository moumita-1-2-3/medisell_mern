
// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// require('dotenv').config();

// const app = express();
// const port = process.env.PORT ;

// app.use(cors());
// app.use(express.json());

// // MongoDB connection
// const uri = process.env.MONGO_URI;
// mongoose.connect(uri);
// const connection = mongoose.connection;

// connection.once('open', () => {
//   console.log('MongoDB connection established successfully');
// });

// // Define your MongoDB schema and model here (if not already done)
// const productSchema = new mongoose.Schema({
  
//   product_name: String,
//   product_price: String,
//   product_manufactured: String,
//   medicine_desc: String,

// });

// const Product = mongoose.model("product", productSchema);

// // Define API routes 
// app.get("/product", async (req, res) => {
//   try {
//     const product = await Product.find();
//     res.json(product);
//     console.log(product)
    
//   } catch (error) {
//     console.error('Error fetching products:', error);
//     res.status(500).send('Internal Server Error');
//   }
// });


// app.get("/product/:courseName", async (req, res) => {
//   try {
//     const doc = await Product.findOne();
//     const course = doc.pro.find((c) => c.product_name === req.params.courseName);
//     res.json(course);
//   } catch (error) {
//     res.status(500).send(error);
//   }
// });

// const userSchema = new mongoose.Schema({
//   name: String,
//   dob: Date,
//   username: String,
//   password: String,
//   userType: String,
//   acceptedTC: Boolean,
// });

// const UserModel = mongoose.model('User', userSchema);

// // API endpoint for posting user data
// app.post('/signin', async (req, res) => {
//   try {
//     const newUser = new UserModel(req.body);
//     await newUser.save();
//     res.status(201).json({ message: 'User registered successfully' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Internal Server Error' });
//   }
// });


// // const User = mongoose.model("user", productSchema);
// // app.post("/sigin", (req, res) => {
// //   User.push(req.body);
// //   res.send("Course added");
// // });

// // app.post("/product", async (req, res) => {
// //   try {
// //     const doc11 = await Product.findOne();
// //     doc11.pro.push(req.body);
// //     await doc11.save();
// //     res.status(201).send("Course added successfully");
// //   } catch (error) {
// //     res.status(500).send(error);
// //   }
// // });
// // Assuming you already have the Product model and mongoose connection

// // Define API routes
// // app.post("/singin", async (req, res) => {
// //   try {
// //     // Assuming you have a Product model defined using mongoose
// //     const newUser = new User({
// //       name: req.body.name,
// //       dob: req.body.dob,
// //       username: req.body.username,
// //       select: req.body.select,
// //       password:req.body.password,
// //       checkbox:req.body.checkbox,
// //     });

// //     // Save the new product to the "product" collection
// //     await newUser.save();

// //     res.status(201).send("Product added successfully");
// //   } catch (error) {
// //     console.error('Error adding product:', error);
// //     res.status(500).send(error);
// //   }
// // });


// // Start the server
// app.listen(port, () => {
//   console.log(`Server is running on http://localhost:${port}`);
// });


