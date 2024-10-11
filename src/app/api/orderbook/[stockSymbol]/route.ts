import { NextRequest, NextResponse } from 'next/server';
import { getOrderbook } from '@/lib/state';

export async function GET(
  request: NextRequest,
  { params }: { params: { stockSymbol: string } }
) {
  const stockSymbol = params.stockSymbol;
  
  try {
    const orderbook = await getOrderbook(stockSymbol);

    if (!orderbook) {
      return NextResponse.json({ yes: {}, no: {} }, { status: 200 });
    }

    return NextResponse.json(orderbook);
  } catch (error) {
    console.error('Error fetching orderbook:', error);
    return NextResponse.json({ error: 'Failed to fetch orderbook' }, { status: 500 });
  }
}