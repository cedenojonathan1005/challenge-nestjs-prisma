import {
  MessageBody,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Task } from '@prisma/client';
import { Server } from 'socket.io';

@WebSocketGateway()
export class AppGateway {
  @WebSocketServer()
  server: Server;

  handleUpdateTodo(@MessageBody() payload: Task) {
    this.server.emit('todoUpdated', payload);
  }
}
