import { Test, TestingModule } from '@nestjs/testing';
import ComicsController from './comics.controller';
import ComicsService from '../../core/service/comics.service';
import Comics from '../../core/entity/comics.entity';
import ComicsPagesQueryDto from '../dto/comics-pages-query.dto';

const comicsListPages = [
    new Comics({
        id: 1,
        name: 'Naruto v1',
        year_publication: 1999,
        month_publication: 9,
        number_pages: 30,
        publisher: 'Shonen Jumps',
        age_rating: 10,
        price: 29.99,
        images: [
            {
                id: 1,
                buffer: undefined,
                encoding: '',
                mimetype: '',
                originalname: '',
                size: 0,
                comics_id: 0,
                comics: undefined,
            },
        ],
        collection: [
            {
                id: 1,
                name: 'Manga',
                description: 'História em quadrinhos japonês',
                comics: [],
            },
        ],
    }),
    new Comics({
        id: 2,
        name: 'Naruto v2',
        year_publication: 1999,
        month_publication: 9,
        number_pages: 30,
        publisher: 'Shonen Jumps',
        age_rating: 10,
        price: 29.99,
        images: [
            {
                id: 4,
                buffer: undefined,
                encoding: '',
                mimetype: '',
                originalname: '',
                size: 0,
                comics_id: 0,
                comics: undefined,
            },
        ],
        collection: [
            {
                id: 1,
                name: 'Manga',
                description: 'História em quadrinhos japonês',
                comics: [],
            },
        ],
    }),
];

describe('ComicsController', () => {
    let comicsController: ComicsController;
    let comicsService: ComicsService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [ComicsController],
            providers: [
                {
                    provide: ComicsService,
                    useValue: {
                        listPages: jest.fn().mockResolvedValue(comicsListPages),
                        getById: jest.fn(),
                        create: jest.fn(),
                        update: jest.fn(),
                        delete: jest.fn(),
                    },
                },
            ],
        }).compile();

        comicsController = module.get<ComicsController>(ComicsController);
        comicsService = module.get<ComicsService>(ComicsService);
    });

    it('Should be defined', () => {
        expect(comicsController).toBeDefined();
        expect(comicsService).toBeDefined();
    });

    describe('listPages', () => {
        it('should return list of pages comics successfully', async () => {
            const comicsPagesQueryDto = new ComicsPagesQueryDto();

            comicsPagesQueryDto.take = 2;
            comicsPagesQueryDto.skip = 0;

            const result =
                await comicsController.listPages(comicsPagesQueryDto);

            expect(result).toEqual(comicsListPages);
        });
    });
});
