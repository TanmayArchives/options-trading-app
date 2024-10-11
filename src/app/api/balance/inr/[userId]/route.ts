import { NextRequest, NextResponse } from 'next/server';
import { getINRBalance } from '@/lib/state';

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  const userId = params.userId;
  const balance = await getINRBalance(userId);

  if (!balance) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  return NextResponse.json(balance);
}