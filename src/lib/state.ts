import clientPromise from './mongodb';

export async function getINRBalance(userId: string) {
  const client = await clientPromise;
  const db = client.db();
  let balance = await db.collection('inr_balances').findOne({ userId });
  
  if (!balance) {
   
    balance = { userId, balance: 100000, locked: 0 }; 
    await db.collection('inr_balances').insertOne(balance);
  }
  
  return balance;
}

export async function updateINRBalance(userId: string, amount: number, isLocked: boolean = false) {
  const client = await clientPromise;
  const db = client.db();
  const field = isLocked ? 'locked' : 'balance';
  await db.collection('inr_balances').updateOne(
    { userId },
    { $inc: { [field]: amount } },
    { upsert: true }
  );
}

export async function getStockBalance(userId: string, stockSymbol: string) {
  const client = await clientPromise;
  const db = client.db();
  const balance = await db.collection('stock_balances').findOne({ userId, stockSymbol });
  return balance || { yes: { quantity: 0, locked: 0 }, no: { quantity: 0, locked: 0 } };
}

export async function updateStockBalance(userId: string, stockSymbol: string, type: 'yes' | 'no', quantity: number, isLocked: boolean = false) {
  const client = await clientPromise;
  const db = client.db();
  const field = isLocked ? 'locked' : 'quantity';
  await db.collection('stock_balances').updateOne(
    { userId, stockSymbol },
    { $inc: { [`${type}.${field}`]: quantity } },
    { upsert: true }
  );
}

export async function getOrderbook(stockSymbol: string) {
  const client = await clientPromise;
  const db = client.db();
  const orderbook = await db.collection('orderbooks').findOne({ stockSymbol });
  return orderbook || { yes: {}, no: {} };
}

export async function addOrder(stockSymbol: string, type: 'yes' | 'no', price: number, userId: string, quantity: number) {
  const client = await clientPromise;
  const db = client.db();
  await db.collection('orderbooks').updateOne(
    { stockSymbol },
    {
      $inc: {
        [`${type}.${price}.total`]: quantity,
        [`${type}.${price}.orders.${userId}`]: quantity
      }
    },
    { upsert: true }
  );
}

export async function updateOrderbook(
  stockSymbol: string, 
  orderType: 'yes' | 'no', 
  price: string, 
  quantityChange: number, 
  orders: Record<string, number>
) {
  const client = await clientPromise;
  const db = client.db();
  
  const update: any = {};
  update[`${orderType}.${price}.total`] = quantityChange;

  for (const [userId, amount] of Object.entries(orders)) {
    update[`${orderType}.${price}.orders.${userId}`] = -Math.min(amount, Math.abs(quantityChange));
  }

  await db.collection('orderbooks').updateOne(
    { stockSymbol },
    { $inc: update }
  );

  await db.collection('orderbooks').updateOne(
    { stockSymbol },
    { 
      $pull: { 
        [`${orderType}.${price}.orders`]: { $lte: 0 },
        [`${orderType}`]: { total: { $lte: 0 } }
      } 
    }
  );
}