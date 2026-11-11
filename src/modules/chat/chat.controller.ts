import { Body, Controller, Post } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { Public } from 'src/common/decorators/public.decorator';
import { ChatService } from './chat.service';
import { ChatDto } from './dto/chat.dto';

@Controller('chat')
export class ChatController {
  constructor(private readonly chat: ChatService) {}
  @Public()
  @Post()
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  async send(@Body() chatDto: ChatDto) {
    return { reply: await this.chat.ask(chatDto.message) };
  }
}
