const dotenv = require('dotenv');
dotenv.config();

if (process.env.NODE_ENV !== 'production') {
    const dns = require('dns');
    dns.setServers(['8.8.8.8', '8.8.4.4']);
}

const express = require('express');
const app = express();

const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');
const cors = require('cors');

const database = require('./config/database');
const { cloudinaryConnect } = require('./config/cloudinary');

const userRoutes = require('./routes/User');
const profileRoutes = require('./routes/profile');
const paymentRoutes = require('./routes/Payments');
const courseRoutes = require('./routes/Course');
const aiRoutes = require('./routes/AI');



const port = process.env.PORT || 4000;

// database connection
database.connect();

// middleware
app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
        origin: "http://localhost:3000", // frontend origin
        credentials: true, // allow cookies to be sent with requests
    })
);
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/"
}));

// connect Cloudinary
cloudinaryConnect();

// routes
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/profile', profileRoutes);
app.use('/api/v1/payment', paymentRoutes);
app.use('/api/v1/course', courseRoutes);
app.use('/api/v1/ai', aiRoutes);


app.get('/', (req, res) => {
    res.send("welcome to my server EDUFY");
});

app.listen(port, () => {
    console.log(`server is running on port ${port}`);
});