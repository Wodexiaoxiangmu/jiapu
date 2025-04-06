import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// 连接数据库
connectDB();

// 家族成员模型
const MemberSchema = new mongoose.Schema({
  name: String,
  contact: String,
  additionalInfo: String,
  children: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Member' }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Member = mongoose.model('Member', MemberSchema);

// API路由
app.get('/api/members', async (req, res) => {
  try {
    const members = await Member.find().populate('children');
    res.json(members);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/members', async (req, res) => {
  const member = new Member(req.body);
  try {
    const newMember = await member.save();
    res.status(201).json(newMember);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.put('/api/members/:id', async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);
    if (member) {
      Object.assign(member, req.body);
      member.updatedAt = Date.now();
      const updatedMember = await member.save();
      res.json(updatedMember);
    } else {
      res.status(404).json({ message: '成员未找到' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.delete('/api/members/:id', async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);
    if (member) {
      await Member.deleteOne({ _id: req.params.id });
      res.json({ message: '成员已删除' });
    } else {
      res.status(404).json({ message: '成员未找到' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`服务器运行在端口 ${PORT}`);
});