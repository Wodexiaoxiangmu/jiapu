import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/jiapu', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log(`MongoDB连接成功: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB连接错误: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;