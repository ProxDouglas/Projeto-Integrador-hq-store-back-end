import { Test, TestingModule } from '@nestjs/testing';
import AutorController from './autor.controller';
import AutorService from '../../core/service/autor.service';
import AutorDto from '../dto/autor.dto';
import Autor from '../../core/entity/autor.entity';

describe('AutorController', () => {
    let controller: AutorController;
    let service: AutorService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AutorController],
            providers: [
                {
                    provide: AutorService,
                    useValue: {
                        list: jest.fn(),
                        getById: jest.fn(),
                        create: jest.fn(),
                        update: jest.fn(),
                    },
                },
            ],
        }).compile();

        controller = module.get<AutorController>(AutorController);
        service = module.get<AutorService>(AutorService);
    });

    describe('list', () => {
        it('should return a list of authors', async () => {
            const mockAuthors: Autor[] = [
                { id: 1, nome: 'Autor 1' },
                { id: 2, nome: 'Autor 2' },
            ];
            jest.spyOn(service, 'list').mockResolvedValue(mockAuthors);

            const result = await controller.list();

            expect(result).toBe(mockAuthors);
            expect(service.list).toHaveBeenCalled();
        });
    });

    describe('getById', () => {
        it('should return an author by ID', async () => {
            const mockAuthor: Autor = { id: 1, nome: 'Autor 1' };
            jest.spyOn(service, 'getById').mockResolvedValue(mockAuthor);

            const result = await controller.getById(1);

            expect(result).toBe(mockAuthor);
            expect(service.getById).toHaveBeenCalledWith(1);
        });

        it('should throw an error if the author is not found', async () => {
            jest.spyOn(service, 'getById').mockRejectedValue(
                new Error('Author not found'),
            );

            await expect(controller.getById(1)).rejects.toThrow(
                'Author not found',
            );
        });
    });

    describe('create', () => {
        it('should create a new author', async () => {
            const mockAuthorDto: AutorDto = { id: 0, nome: 'Autor 1' };
            const mockCreatedAuthor: AutorDto = {
                id: 0,
                nome: 'Autor 1',
            };

            jest.spyOn(service, 'create').mockResolvedValue(mockCreatedAuthor);

            const result = await controller.create(mockAuthorDto);

            expect(result).toBe(mockCreatedAuthor);
            expect(service.create).toHaveBeenCalledWith(mockAuthorDto);
        });
    });

    describe('update', () => {
        it('should update an author by ID', async () => {
            const mockAuthorDto: AutorDto = {
                id: 0,
                nome: 'Autor Atualizado',
            };
            const mockUpdatedAuthor: AutorDto = {
                id: 0,
                nome: 'Autor Atualizado',
            };
            jest.spyOn(service, 'update').mockResolvedValue(mockUpdatedAuthor);

            const result = await controller.update(1, mockAuthorDto);

            expect(result).toBe(mockUpdatedAuthor);
            expect(service.update).toHaveBeenCalledWith(1, mockAuthorDto);
        });
    });

    describe('delete', () => {
        it('should delete an author by ID', async () => {
            const mockAuthor: Autor = { id: 1, nome: 'Autor 1' };
            jest.spyOn(service, 'getById').mockResolvedValue(mockAuthor);

            const result = await controller.delete(1);

            expect(result).toBe(mockAuthor);
            expect(service.getById).toHaveBeenCalledWith(1);
        });
    });
});
