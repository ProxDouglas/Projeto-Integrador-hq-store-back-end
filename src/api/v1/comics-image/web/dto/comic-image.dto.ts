import { IsInt, Min, Max, Length, IsNotEmpty, IsNumber } from 'class-validator';

export default class ComicsImageDto {
    id: number;

    @IsNotEmpty()
    buffer: Buffer;

    @IsNotEmpty()
    encoding: string;

    @IsNotEmpty()
    mimetype: string;

    @IsNotEmpty()
    originalname: string;

    @IsNotEmpty()
    size: number;

    @IsNotEmpty()
    comics_id: number;
}
