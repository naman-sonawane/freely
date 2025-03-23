require('dotenv').config();

const path = require("node:path");
const uploadRoutes = require('./routes/uploadRoutes.js');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { scheduleNewsPrefetching } = require('./services/newsScheduler');
const newsRoutes = require('./routes/newsRoutes');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(cookieParser());


const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1);
    }
};

connectDB();

const linkPreviewRoutes = require('./routes/linkPreviewRoutes');
const userRoutes = require('./routes/userRoutes');

app.use('/api', uploadRoutes);
app.use('/api/users', userRoutes);
app.use('/api', linkPreviewRoutes);
app.use('/api/news', newsRoutes);

app.use("/assets", express.static(path.join(__dirname, "..", "frontend", "dist", "assets")))

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "frontend", "dist", "index.html"));
}); 

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
    scheduleNewsPrefetching();
});

