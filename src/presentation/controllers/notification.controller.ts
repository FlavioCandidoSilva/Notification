import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, NotFoundException, Inject } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiResponse, ApiTags, ApiParam } from '@nestjs/swagger';
import { CreateNotificationDto } from '../../domain/notification/requests/notification.dto';
import { INotificationAppService } from 'src/application/notification/interfaces/notification.app.services.interface';
import { NotificationStatusService } from 'src/application/notification/services/notification-status.service';

@ApiTags('Notificações')
@Controller('api/notificar')
export class NotificationController {
  constructor(
    private readonly notificationAppService: INotificationAppService,
    @Inject(NotificationStatusService) private readonly statusService: NotificationStatusService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiBody({
    type: CreateNotificationDto,
    examples: {
      exemplo: {
        summary: 'Exemplo de requisição',
        value: {
          mensagemId: '123e4567-e89b-12d3-a456-426614174000',
          conteudoMensagem: 'Olá, esta é uma notificação!'
        }
      }
    }
  })
  @ApiResponse({
    status: 202,
    description: 'Notificação recebida para processamento',
    schema: {
      example: { mensagemId: '123e4567-e89b-12d3-a456-426614174000' }
    }
  })
  async notificar(@Body() body: CreateNotificationDto) {
    await this.notificationAppService.create(body);
    return { mensagemId: body.mensagemId };
  }

  @Get('status/:mensagemId')
  @ApiParam({ name: 'mensagemId', example: '123e4567-e89b-12d3-a456-426614174000' })
  @ApiOkResponse({
    description: 'Status da notificação',
    schema: {
      example: {
        mensagemId: '123e4567-e89b-12d3-a456-426614174000',
        status: 'PROCESSADO_SUCESSO'
      }
    }
  })
  async getStatus(@Param('mensagemId') mensagemId: string) {
    const status = this.statusService.getStatus(mensagemId);
    if (!status) {
      throw new NotFoundException('Status não encontrado para o mensagemId informado');
    }
    return { mensagemId, status };
  }
}