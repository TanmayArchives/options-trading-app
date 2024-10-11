import { NextRequest, NextResponse } from 'next/server';
import { getStockBalance } from '@/lib/state';

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  const userId = params.userId;
  const { searchParams } = new URL(request.url);
  const stockSymbol = searchParams.get('stockSymbol');

  if (!stockSymbol) {
    return NextResponse.json({ error: 'Stock symbol is required' }, { status: 400 });
  }

  const balance = await getStockBalance(userId, stockSymbol);

  if (!balance) {
    return NextResponse.json({ error: 'Balance not found' }, { status: 404 });
  }

  // Ensure the balance object has the expected structure
  const formattedBalance = {
    [stockSymbol]: {
      yes: balance.yes || { quantity: 0, locked: 0 },
      no: balance.no || { quantity: 0, locked: 0 }
    }
  };

  return NextResponse.json(formattedBalance);
}