import ComicsMapper from './comics-mapper';
import Comics from '../../core/entity/comics.entity';
import ComicsDto from '../dto/comics.dto';

describe('ComicsMapper', () => {
    let createComicsMapper: ComicsMapper;

    beforeEach(async () => {
        createComicsMapper = new ComicsMapper();
    });

    it('should convert Dto to Entity', () => {
        const comicsDto = new ComicsDto();
        comicsDto.id = 1;
        comicsDto.name = 'Naruto V1';

        const comics = new Comics();
        comics.id = 1;
        comics.name = 'Naruto V1';

        const comicsResult = createComicsMapper.toEntity(comicsDto);

        expect(comicsResult.id).toBe(comics.id);
        expect(comicsResult.name).toBe(comics.name);
    });

    it('should convert Entity to Dto', () => {
        const comicsDto = new ComicsDto();
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
