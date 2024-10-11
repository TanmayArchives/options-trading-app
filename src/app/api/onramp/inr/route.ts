import { NextRequest, NextResponse } from 'next/server';
import { updateINRBalance } from '@/lib/state';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { userId, amount } = body;

  if (!userId || !amount || typeof amount !== 'number' || amount <= 0) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  }

  await updateINRBalance(userId, amount);

  return NextResponse.json({ success: true });
}