import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateNotificationDto } from '../requests/notification.dto';
import { isUUID } from 'class-validator';
import { INotificationService } from '../interface/notification.interface';

@Injectable()
export class NotificationService implements INotificationService {

    async validateCreateNotification(dto: CreateNotificationDto): Promise<string> {

        if (!dto.conteudoMensagem || dto.conteudoMensagem.trim() === '') {
            throw new BadRequestException('conteudoMensagem não pode ser vazio');
        }
        if (!dto.mensagemId || !isUUID(dto.mensagemId)) {
            throw new BadRequestException('mensagemId deve ser um UUID válido');
        }

        return 'Validação bem-sucedida';
    }
} 