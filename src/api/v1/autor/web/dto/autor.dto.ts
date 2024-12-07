import { ApiProperty } from '@nestjs/swagger';
import { Length, IsNotEmpty } from 'class-validator';

export default class AutorDto {
    @ApiProperty()
    id: number;

    @ApiProperty()
    @Length(2, 255)
    @IsNotEmpty()
    nome: string;
}
