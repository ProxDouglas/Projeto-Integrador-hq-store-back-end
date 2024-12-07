import { ApiProperty } from '@nestjs/swagger';
import { Length, IsNotEmpty } from 'class-validator';

export default class ApreciadorDto {
    @ApiProperty()
    id: number;

    @ApiProperty()
    @Length(2, 255)
    @IsNotEmpty()
    nome: string;

    @ApiProperty()
    @Length(2, 11)
    @IsNotEmpty()
    cpf: string;

    @ApiProperty()
    @Length(2, 255)
    @IsNotEmpty()
    email: string;
}
