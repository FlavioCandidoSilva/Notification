import { Injectable, OnModuleInit } from '@nestjs/common';
import { NotificationStatusService } from './notification-status.service';
import { connect, Channel, ConsumeMessage } from 'amqplib';

@Injectable()
export class NotificationConsumerService implements OnModuleInit {
  private channel: Channel;
  private readonly queue = 'fila.notificacao.entrada.notification';
  private readonly statusQueue = 'fila.notificacao.status.notification';

  constructor(
    private readonly statusService: NotificationStatusService,
  ) {}

  async onModuleInit() {
    console.log('NotificationConsumerService inicializado!');
    const connection = await connect('amqp://admin:admin@localhost:5672');
    this.channel = await connection.createChannel();
    
    await this.channel.prefetch(1);
    
    await this.channel.assertQueue(this.queue, { durable: true });
    await this.channel.assertQueue(this.statusQueue, { durable: true });
    
    // Consome mensagens com acknowledgment
    this.channel.consume(this.queue, (msg) => this.handleMessageWithRetry(msg), { noAck: false });
    console.log('Consumindo fila:', this.queue);
  }

  private async handleMessageWithRetry(msg: ConsumeMessage | null, retries = 3) {
    if (!msg) return;
    
    try {
      console.log('Mensagem recebida, processando...');
      await this.handleMessage(msg);
      
      this.channel.ack(msg);
      console.log('Mensagem processada e confirmada');
      
    } catch (error) {
      console.error('Erro ao processar mensagem:', error);
      
      if (retries > 0) {
        this.channel.nack(msg, false, true);
        console.log(`Tentativa ${4 - retries} falhou, tentando novamente... (${retries} tentativas restantes)`);
        
        setTimeout(() => {
          this.handleMessageWithRetry(msg, retries - 1);
        }, 2000);
      } else {
        this.channel.ack(msg);
        console.log('Mensagem removida após todas as tentativas de processamento');
      }
    }
  }

  private async handleMessage(msg: ConsumeMessage | null) {
    if (!msg) return;
    
    const content = JSON.parse(msg.content.toString());
    const { mensagemId, conteudoMensagem } = content;
    
    console.log('Processando mensagem:', { mensagemId, conteudoMensagem });

    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));

    // Gera status aleatório (20% de chance de falha)
    const status = Math.floor(Math.random() * 10) < 2 ? 'FALHA_PROCESSAMENTO' : 'PROCESSADO_SUCESSO';

    this.statusService.setStatus(mensagemId, status);
    console.log('Status salvo em memória:', { mensagemId, status });

    this.channel.sendToQueue(this.statusQueue, Buffer.from(JSON.stringify({ mensagemId, status })));
    console.log('Status publicado na fila de status:', this.statusQueue);
  }
} 