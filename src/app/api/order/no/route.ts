import { NextRequest, NextResponse } from 'next/server';
import { getStockBalance, updateStockBalance, addOrder, getOrderbook } from '@/lib/state';
import { matchOrders } from '@/lib/matchingEngine';
import { io } from '@/pages/api/socketio';

export async function POST(request: NextRequest) {
  console.log('Received NO order request');
  try {
    const body = await request.json();
    const { userId, stockSymbol, quantity, price } = body;

    console.log('Order details:', { userId, stockSymbol, quantity, price });

    if (!userId || !stockSymbol || !quantity || !price) {
      console.log('Invalid input');
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }


    processOrder(userId, stockSymbol, quantity, price);

    return NextResponse.json({ success: true, message: 'Order received and being processed' });
  } catch (error) {
    console.error('Error processing NO order:', error);
    return NextResponse.json({ error: 'Failed to process order' }, { status: 500 });
  }
}

async function processOrder(userId: string, stockSymbol: string, quantity: number, price: number) {
  try {
    const userStockBalance = await getStockBalance(userId, stockSymbol);
    if (!userStockBalance || userStockBalance.yes.quantity < quantity) {
      console.log('Insufficient stock balance');
      return;
    }

    await updateStockBalance(userId, stockSymbol, 'yes', -quantity);
    await updateStockBalance(userId, stockSymbol, 'yes', quantity, true);
    await addOrder(stockSymbol, 'no', price, userId, quantity);
    await matchOrders(stockSymbol);


    const updatedOrderbook = await getOrderbook(stockSymbol);
    if (io) {
      io.to(stockSymbol).emit('orderbook_update', updatedOrderbook);
      console.log(`Emitted orderbook update for ${stockSymbol}`);
    } else {
      console.log('Socket.IO instance not available');
    }
  } catch (error) {
    console.error('Error processing order:', error);
  }
}