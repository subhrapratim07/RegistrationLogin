const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const orderRoutes = require('./routes/orderRoutes');
const auth = require('./routes/auth');
const itemRoutes = require('./routes/itemRoutes');
const deliveryPersonRoutes = require('./routes/deliveryPersonRoutes');
const bookTableRoutes = require('./routes/bookTableRoutes');
const userRoutes = require('./routes/userRoutes');
const reportRoutes = require('./routes/reportRoutes');


const app = express();
const PORT = 500;

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.use(orderRoutes);
app.use(auth);
app.use('/items', itemRoutes);  // ✅ This must be prefixed!
app.use('/delivery_persons', deliveryPersonRoutes);
app.use(bookTableRoutes);
app.use(userRoutes);
app.use('/api/reports', reportRoutes);

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
