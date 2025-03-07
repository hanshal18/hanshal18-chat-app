import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatGateway } from './chat/chat.gateway';
import { ChatService } from './chat/chat.service';
// import { ServeStaticModule } from '@nestjs/serve-static';
// import { join } from 'path';

/**
 * The root module of the application, registering the ChatGateway.
 */
@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, ChatGateway, ChatService], // Register the WebSocket gateway
})
export class AppModule {}
