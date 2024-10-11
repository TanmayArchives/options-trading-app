import clientPromise from './mongodb';
import { ObjectId } from 'mongodb';
import bcrypt from 'bcryptjs';

export async function createUser(username: string, password: string) {
  const client = await clientPromise;
  const db = client.db();
  
  const existingUser = await db.collection('users').findOne({ username });
  if (existingUser) {
    throw new Error('Username already exists');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const result = await db.collection('users').insertOne({
    username,
    password: hashedPassword,
  });

  return { id: result.insertedId, username };
}

export async function validateUser(username: string, password: string) {
  const client = await clientPromise;
  const db = client.db();
  
  const user = await db.collection('users').findOne({ username });
  if (!user) {
    return null;
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    return null;
  }

  return { id: user._id, username: user.username };
}

export async function getUserById(id: string) {
  const client = await clientPromise;
  const db = client.db();
  
  const user = await db.collection('users').findOne({ _id: new ObjectId(id) });
  if (!user) {
    return null;
  }

  return { id: user._id.toString(), username: user.username };
}