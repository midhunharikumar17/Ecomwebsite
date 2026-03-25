# 🛍️ ShopApp — Full-Stack E-Commerce Platform

A production-grade e-commerce web application built with React, Redux Toolkit, Node.js, Express, and MongoDB. Features real-time order updates, AI-powered chatbot, Razorpay payment integration, and a full admin dashboard.

---


## 📸 Screenshots

>#### HomePage
![Home]ecom-site/screenshot/Home.png
>#### Products
![Products](screenshot\Products.png)
>#### Footer
![Footer](screenshot\Footer.png)
>####  Wishlist
![Wishlist](screenshot\Wishlist.png)
>#### Cart
![Cart](screenshot\Cart.png)
>#### Checkout
![Checkot](screenshot\Checkout.png)
>#### Checkout Review
![Creview](screenshot\Checkout Review.png)
>#### Payment
![Payment](screenshot\Payment.png)
>#### Orders
![Orders](screenshot\Orders.png)
>#### Chatbot
![Chatbot](screenshot\Chatbot.png)
>#### Admin Dashboard
![Admin Dashboard](screenshot\AdminDashboard.png)
  
## ✨ Features

### User
- 🔐 JWT-based authentication (Register / Login)
- 🏠 Product browsing with category filters and search
- 📦 Product detail page with image gallery, stock indicator, quantity selector
- 🛒 Cart with quantity controls, savings summary, and free delivery threshold
- 🤍 Wishlist with move-to-cart functionality
- 💳 Checkout with Razorpay payment gateway
- 📋 Order history with expandable order details and status tracking
- 🤖 AI chatbot (Google Gemini) for product assistance
- 💬 Live customer support chat via Socket.io

### Admin
- 📊 Dashboard with revenue, orders, users, and product stats
- 📦 Product management — add, edit, delete with image preview
- 🧾 Order management — filter by status, update with live Socket.io push
- 👥 User management — activate/deactivate accounts
- 💬 Real-time admin chat with customers

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js, Redux Toolkit, redux-persist |
| Styling | Custom CSS, Inter, Playfair Display, DM Sans |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Auth | JWT, bcrypt |
| Real-time | Socket.io |
| Payments | Razorpay |
| AI | Google Gemini API |

---

## 📁 Project Structure

```
├── ecom-site/                  # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/         # Navbar, Footer, Chatbot, AdminLayout
│   │   │   └── product/        # ProductCard
│   │   ├── context/            # SocketContext
│   │   ├── pages/
│   │   │   ├── auth/           # Login, Register
│   │   │   ├── user/           # Home, ProductDetails, Cart, Wishlist, Orders, Checkout
│   │   │   └── admin/          # Dashboard, Products, Orders, Users, AdminChat
│   │   ├── redux/
│   │   │   ├── slices/         # authSlice, cartSlice, wishlistSlice, productSlice
│   │   │   └── store.js
│   │   └── services/           # axiosInstance.js, api.js
│   └── .env
│
└── ecom-backend/               # Express backend
    ├── controllers/            # auth, product, order, admin, chat
    ├── models/                 # User, Product, Order, Category
    ├── routes/                 # auth, product, order, admin, chat
    ├── middleware/             # authMiddleware.js
    ├── server.js
    └── .env
```

---

## ⚙️ Getting Started

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (or local MongoDB)
- Razorpay account (test keys)
- Google Gemini API key

### 1. Clone the repository

```bash
git clone https://github.com/midhunharikumar17/Ecomwebsite.git
cd Ecomwebsite
```

### 2. Backend setup

```bash
cd ecom-backend
npm install
```

Create `ecom-backend/.env`:

```env
MONGO_URI=mongodb+srv://your_connection_string
PORT=5000
CLIENT_URL=http://localhost:5173
JWT_SECRET=your_jwt_secret
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxx
GEMINI_API_KEY=your_gemini_api_key
```

```bash
npm run dev
```

### 3. Frontend setup

```bash
cd ecom-site
npm install
```

Create `ecom-site/.env`:

```env
VITE_API_URL=http://localhost:5000/api
VITE_RAZORPAY_KEY=rzp_test_xxxxxxxxxxxx
```

```bash
npm run dev
```

### 4. Make a user admin

Open MongoDB shell or Compass and run:

```js
db.users.updateOne(
  { email: "your@email.com" },
  { $set: { role: "admin" } }
)
```

Then log out and log back in to refresh the JWT token.

---

## 🔑 Environment Variables

| Variable | Location | Description |
|---|---|---|
| `MONGO_URI` | Backend | MongoDB connection string |
| `JWT_SECRET` | Backend | Secret key for JWT signing |
| `RAZORPAY_KEY_ID` | Backend + Frontend | Razorpay public key |
| `RAZORPAY_KEY_SECRET` | Backend | Razorpay secret key |
| `GEMINI_API_KEY` | Backend | Google Gemini API key |
| `CLIENT_URL` | Backend | Frontend URL for CORS |
| `VITE_API_URL` | Frontend | Backend API base URL |

---

## 📡 API Endpoints

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login and get JWT |

### Products
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/products` | Get all products |
| GET | `/api/products/:id` | Get single product |

### Orders
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/orders` | Create order + Razorpay order |
| POST | `/api/orders/verify-payment` | Verify Razorpay signature |
| GET | `/api/orders` | Get user's orders |

### Admin (protected)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/admin/stats` | Dashboard stats |
| GET | `/api/admin/orders` | All orders |
| PUT | `/api/admin/orders/:id` | Update order status |
| GET | `/api/admin/users` | All users |
| PUT | `/api/admin/users/:id` | Update user status |

---

## 🧪 Test Payment Details

```
Card Number : 4111 1111 1111 1111
Expiry      : Any future date
CVV         : Any 3 digits
OTP         : 1234
```

---

## 📄 License

MIT License — free to use and modify.

---

## 👤 Author

**Midhun Harikumar**
GitHub: [@midhunharikumar17](https://github.com/midhunharikumar17)