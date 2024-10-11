import { getOrderbook, updateINRBalance, updateStockBalance, updateOrderbook } from './state';
import { io } from '@/pages/api/socketio';

export async function matchOrders(stockSymbol: string) {
  const orderbook = await getOrderbook(stockSymbol);
  if (!orderbook || !orderbook.yes || !orderbook.no) {
    console.log('Orderbook is empty or invalid');
    return;
  }

  const yesOrders = Object.entries(orderbook.yes).sort(([a], [b]) => parseFloat(b) - parseFloat(a));
  const noOrders = Object.entries(orderbook.no).sort(([a], [b]) => parseFloat(a) - parseFloat(b));

  const matchedOrders: MatchedOrder[] = [];

  while (yesOrders.length > 0 && noOrders.length > 0) {
    const [yesPriceStr, yesData] = yesOrders[0];
    const [noPriceStr, noData] = noOrders[0];
    const yesPrice = parseFloat(yesPriceStr);
    const noPrice = parseFloat(noPriceStr);

    if (yesPrice >= noPrice) {
      const matchPrice = (yesPrice + noPrice) / 2;
      const matchQuantity = Math.min(yesData.total, noData.total);

      matchedOrders.push({ yesData, noData, matchPrice, matchQuantity, yesPrice: yesPriceStr, noPrice: noPriceStr });

      if (yesData.total === matchQuantity) yesOrders.shift();
      else yesData.total -= matchQuantity;

      if (noData.total === matchQuantity) noOrders.shift();
      else noData.total -= matchQuantity;
    } else {
      break;
    }
  }

  for (const match of matchedOrders) {
    await updateBalances(stockSymbol, match.yesData.orders, match.noData.orders, match.matchQuantity, match.matchPrice);
  }

  await removeMatchedOrders(stockSymbol, matchedOrders);

  // Emit updated orderbook
  const updatedOrderbook = await getOrderbook(stockSymbol);
  if (io) {
    io.to(stockSymbol).emit('orderbook_update', updatedOrderbook);
    console.log(`Emitted orderbook update for ${stockSymbol}`);
  } else {
    console.log('Socket.IO instance not available');
  }
}

async function updateBalances(stockSymbol: string, yesOrders: Record<string, number>, noOrders: Record<string, number>, quantity: number, price: number) {
  for (const [userId, amount] of Object.entries(yesOrders)) {
    await updateINRBalance(userId, -amount * price, true);
    await updateStockBalance(userId, stockSymbol, 'yes', amount);
  }

  for (const [userId, amount] of Object.entries(noOrders)) {
    await updateStockBalance(userId, stockSymbol, 'yes', -amount, true);
    await updateINRBalance(userId, amount * price);
  }
}

async function removeMatchedOrders(stockSymbol: string, matchedOrders: MatchedOrder[]) {
  for (const match of matchedOrders) {
    await updateOrderbook(stockSymbol, 'yes', match.yesPrice, -match.matchQuantity, match.yesData.orders);
    await updateOrderbook(stockSymbol, 'no', match.noPrice, -match.matchQuantity, match.noData.orders);
  }
}

interface MatchedOrder {
  yesData: { total: number; orders: Record<string, number> };
  noData: { total: number; orders: Record<string, number> };
  matchPrice: number;
  matchQuantity: number;
  yesPrice: string;
  noPrice: string;
}