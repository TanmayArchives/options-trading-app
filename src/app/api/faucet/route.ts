import { NextRequest, NextResponse } from 'next/server';
import { updateINRBalance } from '@/lib/state';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { userId } = body;

  if (!userId) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  }

  const faucetAmount = 100000; 
  await updateINRBalance(userId, faucetAmount);

  return NextResponse.json({ success: true, amount: faucetAmount });
}