const mongoose = require('mongoose');

const dbConnect = async () => {
    try {
        const connection = await mongoose.connect(process.env.MONGODB_URI);
        //ready states being:
        // 0: disconnected
        // 1: connected
        // 2: connecting
        // 3: disconnecting
        if (connection.connection.readyState === 1) {
            console.log('Database connection sucessfully');
        } else {
            console.log("Connecting to DB");
        }
    } catch (err) {
        console.log('Database connection FAIL');
        throw new Error(err);
    }
}

module.exports = dbConnect;