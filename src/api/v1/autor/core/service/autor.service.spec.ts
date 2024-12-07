import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import Autor from '../entity/autor.entity';
import AutorService from './autor.service';
import AutorDto from '../../web/dto/autor.dto';
import AutorNotFound from '../../web/exception/autor-not-found';
import { DeleteResult, Repository } from 'typeorm';

describe('AutorService', () => {
    let service: AutorService;
    let repository: Repository<Autor>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AutorService,
                {
                    provide: getRepositoryToken(Autor),
                    useValue: {
                        find: jest.fn(),
                        findOneOrFail: jest.fn(),
                        findOneBy: jest.fn(),
                        save: jest.fn(),
                        delete: jest.fn(),
                    },
                },
            ],
        }).compile();

        service = module.get<AutorService>(AutorService);
        repository = module.get<Repository<Autor>>(getRepositoryToken(Autor));
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('list', () => {
        it('should return a list of authors', async () => {
            const mockAuthors: Autor[] = [
                { id: 1, nome: 'Autor 1' },
                { id: 2, nome: 'Autor 2' },
            ];
            jest.spyOn(repository, 'find').mockResolvedValue(mockAuthors);

            const result = await service.list();

            expect(result).toBe(mockAuthors);
            expect(repository.find).toHaveBeenCalled();
        });
    });

    describe('getById', () => {
        it('should return an author by ID', async () => {
            const mockAuthor: Autor = { id: 1, nome: 'Autor 1' };
            jest.spyOn(repository, 'findOneOrFail').mockResolvedValue(
                mockAuthor,
            );

            const result = await service.getById(1);

            expect(result).toBe(mockAuthor);
            expect(repository.findOneOrFail).toHaveBeenCalledWith({
                where: { id: 1 },
            });
        });

        it('should throw AutorNotFound if author is not found', async () => {
            jest.spyOn(repository, 'findOneOrFail').mockRejectedValue(
                new AutorNotFound(1),
            );

            await expect(service.getById(1)).rejects.toThrow(AutorNotFound);
        });
    });

    describe('create', () => {
        it('should create a new author', async () => {
            const mockAutorDto: AutorDto = {
                nome: 'Novo Autor',
                id: 0,
            };
            const mockSavedAuthor: AutorDto = {
                nome: 'Novo Autor',
                id: 0,
            };

            jest.spyOn(repository, 'save').mockResolvedValue(mockSavedAuthor);

            const result = await service.create(mockAutorDto);

            expect(result).toBe(mockSavedAuthor);
            expect(repository.save).toHaveBeenCalledWith(mockAutorDto);
        });
    });

    describe('update', () => {
        it('should update an author by ID', async () => {
            const mockAutorDto: AutorDto = {
                nome: 'Autor Atualizado',
                id: 0,
            };
            const mockAuthor: Autor = { id: 1, nome: 'Autor Original' };
            const mockUpdatedAuthor: Autor = {
                id: 1,
                nome: 'Autor Atualizado',
            };

            jest.spyOn(repository, 'findOneBy').mockResolvedValue(mockAuthor);
            jest.spyOn(repository, 'save').mockResolvedValue(mockUpdatedAuthor);

            const result = await service.update(1, mockAutorDto);

            expect(result).toBe(mockUpdatedAuthor);
            expect(repository.findOneBy).toHaveBeenCalledWith({ id: 1 });
            expect(repository.save).toHaveBeenCalledWith({
                ...mockAuthor,
                nome: 'Autor Atualizado',
            });
        });

        it('should throw AutorNotFound if author is not found during update', async () => {
            jest.spyOn(repository, 'findOneBy').mockResolvedValue(null);

            await expect(
                service.update(1, {
                    nome: 'Novo Nome',
                    id: 0,
                }),
            ).rejects.toThrow(AutorNotFound);
        });
    });

    describe('delete', () => {
        it('should delete an author by ID', async () => {
            const mockAuthor: Autor = { id: 1, nome: 'Autor para Deletar' };

            jest.spyOn(repository, 'findOneBy').mockResolvedValue(mockAuthor);
            jest.spyOn(repository, 'delete').mockResolvedValue({
                affected: 1,
            } as DeleteResult);

            await service.delete(1);

            expect(repository.findOneBy).toHaveBeenCalledWith({ id: 1 });
            expect(repository.delete).toHaveBeenCalledWith(mockAuthor);
        });

        it('should not delete an author if not found', async () => {
            jest.spyOn(repository, 'findOneBy').mockResolvedValue(null);

            await expect(service.delete(1)).resolves.toBeUndefined();
            expect(repository.findOneBy).toHaveBeenCalledWith({ id: 1 });
            expect(repository.delete).not.toHaveBeenCalled();
        });
    });
});
