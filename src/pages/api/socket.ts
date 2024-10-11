import { Server } from 'socket.io';
import type { NextApiRequest, NextApiResponse } from 'next';

const SocketHandler = (req: NextApiRequest, res: NextApiResponse) => {
  if (res.socket.server.io) {
    console.log('Socket is already running');
  } else {
    console.log('Socket is initializing');
    const io = new Server(res.socket.server);
    res.socket.server.io = io;

    io.on('connection', socket => {
      socket.on('subscribe', stockSymbol => {
        socket.join(stockSymbol);
      });

      socket.on('unsubscribe', stockSymbol => {
        socket.leave(stockSymbol);
      });
    });
  }
  res.end();
};

export default SocketHandler;