import { NextRequest, NextResponse } from 'next/server';
import { getINRBalance, updateINRBalance, addOrder, getOrderbook } from '@/lib/state';
import { matchOrders } from '@/lib/matchingEngine';
import { io } from '@/pages/api/socketio';

export async function POST(request: NextRequest) {
  console.log('Received YES order request');
  try {
    const body = await request.json();
    const { userId, stockSymbol, quantity, price } = body;

    console.log('Order details:', { userId, stockSymbol, quantity, price });

    if (!userId || !stockSymbol || !quantity || !price) {
      console.log('Invalid input');
      return NextResponse.json({ success: false, error: 'Invalid input' }, { status: 400 });
    }

    const userBalance = await getINRBalance(userId);
    console.log('User balance:', userBalance);

    if (!userBalance || userBalance.balance < quantity * price) {
      console.log('Insufficient balance');
      return NextResponse.json({ success: false, error: 'Insufficient balance' }, { status: 400 });
    }

    console.log('Updating INR balance');
    await updateINRBalance(userId, -quantity * price);
    await updateINRBalance(userId, quantity * price, true);

    console.log('Adding order to orderbook');
    await addOrder(stockSymbol, 'yes', price, userId, quantity);

    console.log('Calling matching engine');
    await matchOrders(stockSymbol);

    console.log('Fetching updated orderbook');
    const updatedOrderbook = await getOrderbook(stockSymbol);

    console.log('Emitting orderbook update');
    if (io) {
      io.to(stockSymbol).emit('orderbook_update', updatedOrderbook);
    } else {
      console.log('Socket.io instance not available');
    }

    console.log('Order processed successfully');
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error processing YES order:', error);
    return NextResponse.json({ success: false, error: 'Failed to process order' }, { status: 500 });
  }
}