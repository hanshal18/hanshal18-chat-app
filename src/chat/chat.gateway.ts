import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

/**
 * WebSocket gateway for handling real-time chat functionality.
 */
@WebSocketGateway({ cors: { origin: '*' } }) // Enable CORS for cross-origin requests
export class ChatGateway {
  @WebSocketServer()
  server: Server; // The WebSocket server instance

  /**
   * Handles incoming chat messages from clients.
   * @param data - The message data containing sender name and message content.
   * @param client - The socket client sending the message.
   */
  @SubscribeMessage('sendMessage')
  handleMessage(
    @MessageBody() data: { sender: string; message: string },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @ConnectedSocket() client: Socket,
  ): void {
    this.server.emit('receiveMessage', data); // Broadcast the message to all connected clients
  }

  /**
   * Handles user joining the chat.
   * @param data - The username of the user joining the chat.
   * @param client - The socket client connecting.
   */
  @SubscribeMessage('joinRoom')
  handleJoinRoom(
    @MessageBody() data: { username: string },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @ConnectedSocket() client: Socket,
  ): void {
    this.server.emit('userJoined', { username: data.username }); // Notify all clients that a new user joined
  }
}
