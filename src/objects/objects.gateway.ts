import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ObjectResponseDto } from './dto/object-response.dto';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ObjectsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  emitObjectCreated(object: ObjectResponseDto) {
    this.server.emit('objectCreated', object);
  }

  emitObjectDeleted(objectId: string) {
    this.server.emit('objectDeleted', objectId);
  }
}
