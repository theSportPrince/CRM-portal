const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const leadRoutes=require("./routes/leadRoutes")
const userRoutes=require("./routes/userRoutes")
const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('✅ Database connected successfully!'))
  .catch(error => console.error('Database connection error:', error.message));

app.use('/api/leads', leadRoutes);
app.use('/api/users', userRoutes); // Define user routes for authentication

const PORT = process.env.PORT || 8888;
app.listen(PORT, () => {
  console.log(`Express running → On PORT : ${PORT}`);
});
