// ✅ Add to index.js

const cors = require('cors');
const express = require('express');
const sequelize = require('./db');
const DeliveryPersonModel = require('./models/DeliveryPerson');
const FormDataModel = require('./models/FormData');
const BookTableModel = require('./models/BookTable');
const OrderModel = require('./models/Order');
const OrderItemModel = require('./models/OrderItem');
const ItemModel = require('./models/Item');

const app = express();

// ✅ Middleware
app.use(cors());
app.options('*', cors());
app.use(express.json({ limit: '10mb' }));

// ✅ Sync DB
sequelize.sync({ alter: true })
  .then(() => console.log('PostgreSQL DB synced successfully'))
  .catch(err => console.error('Failed to sync DB:', err));

// ✅ Get next order number
app.get('/next-order-number', async (req, res) => {
  try {
    const lastOrder = await OrderModel.findOne({ order: [['createdAt', 'DESC']] });
    let nextOrderNumber = 'ORD-001';
    if (lastOrder) {
      const lastNumber = parseInt(lastOrder.orderNumber.split('-')[1]);
      const newNumber = String(lastNumber + 1).padStart(3, '0');
      nextOrderNumber = `ORD-${newNumber}`;
    }
    res.json({ nextOrderNumber });
  } catch (err) {
    res.status(500).json({ error: 'Failed to get next order number' });
  }
});

// ✅ Register
app.post('/register', async (req, res) => {
  const { email } = req.body;
  try {
    const user = await FormDataModel.findOne({ where: { email } });
    if (user) return res.json('Already registered');
    const newUser = await FormDataModel.create(req.body);
    res.json(newUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

// ✅ Login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await FormDataModel.findOne({ where: { email } });
    if (!user) return res.json('No records found!');
    if (user.password === password) return res.json('Success');
    return res.json('Wrong password');
  } catch (err) {
    res.status(500).json(err);
  }
});

// ✅ Book Table
app.post('/book-table', async (req, res) => {
  try {
    const result = await BookTableModel.create(req.body);
    res.json({ message: 'Booking Successful', data: result });
  } catch (err) {
    res.status(500).json({ error: 'Booking Failed', details: err });
  }
});

app.post('/add-delivery-person', async (req, res) => {
  try {
    const newDelivery = await DeliveryPersonModel.create(req.body);
    res.json({ message: 'Delivery person added successfully!', data: newDelivery });
  } catch (err) {
    console.error('Error adding delivery person:', err);
    res.status(500).json({ error: 'Failed to add delivery person' });
  }
});

app.get('/delivery-persons', async (req, res) => {
  try {
    const persons = await DeliveryPersonModel.findAll();
    res.json(persons);
  } catch (err) {
    console.error('Error fetching delivery persons:', err);
    res.status(500).json({ error: 'Failed to fetch delivery persons' });
  }
});
// ✅ Place Order (linked with Item table)
app.post('/place-order', async (req, res) => {
  try {
    const { orderDate, name, address, pincode, items, deliveryperson } = req.body;

    const lastOrder = await OrderModel.findOne({ order: [['createdAt', 'DESC']] });
    let nextOrderNumber = 'ORD-001';
    if (lastOrder) {
      const lastNumber = parseInt(lastOrder.orderNumber.split('-')[1]);
      const newNumber = String(lastNumber + 1).padStart(3, '0');
      nextOrderNumber = `ORD-${newNumber}`;
    }

    const newOrder = await OrderModel.create({
      orderNumber: nextOrderNumber,
      orderDate,
      name,
      address,
      pincode,
      deliveryperson,
    });

    const orderItems = await Promise.all(items.map(async (item) => {
      // Fetch price from Item table
      const menuItem = await ItemModel.findOne({ where: { itemName: item.item } });
      if (!menuItem) throw new Error(`Item '${item.item}' not found in menu.`);
      return {
        item: item.item,
        quantity: item.quantity,
        price: menuItem.price,
        orderId: newOrder.id
      };
    }));

    await OrderItemModel.bulkCreate(orderItems);

    res.json({
      message: 'Order placed successfully!',
      orderNumber: nextOrderNumber,
    });
  } catch (err) {
    console.error('Error placing order:', err);
    res.status(500).json({ error: 'Failed to place order', details: err.message });
  }
});

// ✅ Add menu item
app.post('/add-item', async (req, res) => {
  try {
    const items = req.body.items;
    const createdItems = await Promise.all(items.map(async (item) => {
      return await ItemModel.create({
        itemId: item.itemId,
        itemName: item.itemName,
        description: item.description,
        price: item.price,
        image: item.image || ''
      });
    }));
    res.json({ message: 'Items added successfully!', items: createdItems });
  } catch (err) {
    console.error('Error adding items:', err);
    res.status(500).json({ error: 'Failed to add items', details: err.message });
  }
});

// ✅ Fetch user info
app.get('/user-info/:email', async (req, res) => {
  try {
    const user = await FormDataModel.findOne({ where: { email: req.params.email } });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ name: user.name, email: user.email, phone: user.phonenumber });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Fetch all menu items
app.get('/menu-items', async (req, res) => {
  try {
    const items = await ItemModel.findAll();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch items' });
  }
});

// ✅ Start Server
app.listen(40001, () => console.log('Server listening on http://localhost:40001'));
