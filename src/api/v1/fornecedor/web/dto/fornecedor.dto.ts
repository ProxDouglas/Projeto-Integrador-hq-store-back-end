import { ApiProperty } from '@nestjs/swagger';
import { Length, IsNotEmpty } from 'class-validator';

export default class FornecedorDto {
    @ApiProperty()
    id: number;

    @ApiProperty()
    @Length(2, 255)
    @IsNotEmpty()
    name: string;

    @ApiProperty()
    @Length(2, 255)
    @IsNotEmpty()
    cnpj: string;

    @ApiProperty()
    @Length(2, 255)
    @IsNotEmpty()
    pais: string;
}
