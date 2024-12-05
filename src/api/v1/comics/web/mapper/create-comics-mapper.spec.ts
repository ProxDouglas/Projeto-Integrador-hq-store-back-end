import CreateComicsMapper from './create-comics-mapper';
import Comics from '../../core/entity/comics.entity';
import CreateComicsDto from '../dto/create-comics.dto';

describe('CreateComicsMapper', () => {
    let createComicsMapper: CreateComicsMapper;

    beforeEach(async () => {
        createComicsMapper = new CreateComicsMapper();
    });

    it('should convert CreateDto to Entity', () => {
        const comicsDto = new CreateComicsDto();
        comicsDto.id = 1;
        comicsDto.name = 'Naruto V1';

        const comics = new Comics();
        comics.id = 1;
        comics.name = 'Naruto V1';

        const comicsResult = createComicsMapper.toEntity(comicsDto);

        expect(comicsResult.id).toBe(comics.id);
        expect(comicsResult.name).toBe(comics.name);
    });

    it('should convert Entity to CreateDto', () => {
        const comicsDto = new CreateComicsDto();
        comicsDto.id = 1;
        comicsDto.name = 'Naruto V1';

        const comics = new Comics();
        comics.id = 1;
        comics.name = 'Naruto V1';

        const comicsDtoResult = createComicsMapper.toDto(comics);

        expect(comicsDtoResult.id).toBe(comicsDto.id);
        expect(comicsDtoResult.name).toBe(comicsDto.name);
    });
});
