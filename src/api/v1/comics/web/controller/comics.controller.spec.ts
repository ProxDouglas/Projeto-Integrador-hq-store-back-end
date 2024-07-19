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
        image: {
            id: 1,
            comics_id: 0,
            comics: undefined,
            name: '',
            url: '',
        },
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
        image: {
            id: 4,
            comics_id: 0,
            comics: undefined,
            name: '',
            url: '',
        },
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

            const take = 2;
            const skip = 2;

            const result = await comicsController.listPages(
                take,
                skip,
                comicsPagesQueryDto,
            );

            expect(result).toEqual(comicsListPages);
        });
    });
});
