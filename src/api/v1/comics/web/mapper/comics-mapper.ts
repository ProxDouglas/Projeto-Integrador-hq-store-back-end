import Comics from '../../core/entity/comics.entity';
import ComicsDto from '../dto/comics.dto';

export default class ComicsMapper {
    public toDto(comics: Comics): ComicsDto {
        const comicsDto = new ComicsDto();

        comicsDto.id = comics.id;
        comicsDto.name = comics.name;
        comicsDto.age_rating = comics.age_rating;
        comicsDto.year_publication = comics.year_publication;
        comicsDto.month_publication = comics.month_publication;
        comicsDto.number_pages = comics.number_pages;
        comicsDto.price = comics.price;
        comicsDto.publisher = comics.publisher;

        return comicsDto;
    }

    public toEntity(comicsDto: ComicsDto): Comics {
        const comics = new Comics();

        comics.id = comicsDto.id;
        comics.name = comicsDto.name;
        comics.age_rating = comicsDto.age_rating;
        comics.year_publication = comicsDto.year_publication;
        comics.month_publication = comicsDto.month_publication;
        comics.number_pages = comicsDto.number_pages;
        comics.price = comicsDto.price;
        comics.publisher = comicsDto.publisher;

        return comics;
    }
}
