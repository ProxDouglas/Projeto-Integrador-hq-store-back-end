import Comics from '../../core/entity/comics.entity';
import CreateComicsDto from '../dto/create-comics.dto';

export default class ComicsMapper {
    public toDto(comics: Comics): CreateComicsDto {
        const createComicsDto = new CreateComicsDto();

        createComicsDto.id = comics.id;
        createComicsDto.name = comics.name;
        createComicsDto.age_rating = comics.age_rating;
        createComicsDto.year_publication = comics.year_publication;
        createComicsDto.month_publication = comics.month_publication;
        createComicsDto.number_pages = comics.number_pages;
        createComicsDto.price = comics.price;
        createComicsDto.publisher = comics.publisher;

        return createComicsDto;
    }

    public toEntity(createComicsDto: CreateComicsDto): Comics {
        const comics = new Comics();

        comics.id = createComicsDto.id;
        comics.name = createComicsDto.name;
        comics.age_rating = createComicsDto.age_rating;
        comics.year_publication = createComicsDto.year_publication;
        comics.month_publication = createComicsDto.month_publication;
        comics.number_pages = createComicsDto.number_pages;
        comics.price = createComicsDto.price;
        comics.publisher = createComicsDto.publisher;

        return comics;
    }
}
