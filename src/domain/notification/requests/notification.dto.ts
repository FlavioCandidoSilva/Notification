

import { IsArray, IsBoolean, IsDate, IsNumber, IsString, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateNotificationDto {

  @IsString()
  @ApiProperty({ description: 'Id da mensagem', example: 'mensagemId' })
  mensagemId: string;

  @IsString()
  @ApiProperty({ description: 'Conteudo da mensaegm', example: 'conteudoMensagem' })
  conteudoMensagem: string;

}