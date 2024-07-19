import { IsInt } from 'class-validator';
import Comics from '../../core/entity/comics.entity';
import { ApiProperty } from '@nestjs/swagger';

export default class ComicsPagesDto {
    @ApiProperty()
    @IsInt()
    pages: number;

    @ApiProperty()
    comics: Comics[];

    constructor(comicsPagesDto?: Partial<ComicsPagesDto>) {
        this.pages = comicsPagesDto?.pages ?? 0;
        this.comics = comicsPagesDto?.comics ?? [];
    }
}
