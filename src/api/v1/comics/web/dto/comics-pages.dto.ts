import { IsInt } from 'class-validator';
import Comics from '../../core/entity/comics.entity';

export default class ComicsPagesDto {
    @IsInt()
    pages: number;

    comics: Comics[];
}
