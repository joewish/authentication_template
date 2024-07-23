import mongoose from "mongoose";
export const connectDB = async () => {
  try {
    console.log("db connecting...");
    const res = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`mongodb connected with server ${res.connection.host}`);
  } catch (error) {
    console.log("mongodb connection failed!");
    console.log(error);
  }
};


// import mongoose from 'mongoose';

// const baseUrl = process.env.MONGODB || '0.0.0.0:27017';

// export const connectUsingMongoose = async () => {
//     try {
//         await mongoose.connect(`mongodb://${baseUrl}/book` , {
//            useNewUrlParser: true,
//            useUnifiedTopology: true
//        });
//         console.log("MongoDB connected using mongoose");
//     } catch (err) {
//         console.log(err);
//     }
// }
