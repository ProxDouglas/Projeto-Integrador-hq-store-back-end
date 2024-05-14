import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min, IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export default class ComicsAssociateDto {
    @ApiProperty()
    @IsPositive()
    @IsNotEmpty()
    @IsInt()
    @IsNumber()
    @Min(1)
    id: number;
}
