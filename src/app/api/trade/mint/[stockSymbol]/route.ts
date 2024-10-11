import { NextRequest, NextResponse } from 'next/server';
import { updateStockBalance } from '@/lib/state';

export async function POST(
  request: NextRequest,
  { params }: { params: { stockSymbol: string } }
) {
  const stockSymbol = params.stockSymbol;
  const body = await request.json();
  const { userId, quantity } = body;

  if (!userId || !quantity || typeof quantity !== 'number' || quantity <= 0) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  }

  try {
    await updateStockBalance(userId, stockSymbol, 'yes', quantity);
    await updateStockBalance(userId, stockSymbol, 'no', quantity);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error minting tokens:', error);
    return NextResponse.json({ error: 'Failed to mint tokens' }, { status: 500 });
  }
}