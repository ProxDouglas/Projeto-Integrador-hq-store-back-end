import { IsNotEmpty } from 'class-validator';

export default class CreateComicsImageDto {
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
