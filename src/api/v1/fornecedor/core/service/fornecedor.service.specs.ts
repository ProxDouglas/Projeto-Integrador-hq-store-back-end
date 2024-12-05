import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import FornecedorService from './fornecedor.service';
import Fornecedor from '../entity/fornecedor.entity';
import FornecedorDto from '../../web/dto/fornecedor.dto';
import FornecedorNotFound from '../../web/exception/fornecedor-not-found';

describe('FornecedorService', () => {
    let service: FornecedorService;
    let fornecedorRepository: Repository<Fornecedor>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                FornecedorService,
                {
                    provide: getRepositoryToken(Fornecedor),
                    useClass: Repository,
                },
            ],
        }).compile();

        service = module.get<FornecedorService>(FornecedorService);
        fornecedorRepository = module.get<Repository<Fornecedor>>(
            getRepositoryToken(Fornecedor),
        );
    });

    describe('list', () => {
        it('should return a list of fornecedores', async () => {
            const fornecedoresMock = [
                { id: 1, name: 'Fornecedor A', cnpj: '123', pais: 'Brasil' },
                { id: 2, name: 'Fornecedor B', cnpj: '456', pais: 'Argentina' },
            ] as Fornecedor[];

            jest.spyOn(fornecedorRepository, 'find').mockResolvedValue(
                fornecedoresMock,
            );

            const result = await service.list();

            expect(result).toEqual(fornecedoresMock);
            expect(fornecedorRepository.find).toHaveBeenCalled();
        });
    });

    describe('getById', () => {
        it('should return a fornecedor by ID', async () => {
            const fornecedorMock = {
                id: 1,
                name: 'Fornecedor A',
                cnpj: '123',
                pais: 'Brasil',
            } as Fornecedor;

            jest.spyOn(fornecedorRepository, 'findOneOrFail').mockResolvedValue(
                fornecedorMock,
            );

            const result = await service.getById(1);

            expect(result).toEqual(fornecedorMock);
            expect(fornecedorRepository.findOneOrFail).toHaveBeenCalledWith({
                where: { id: 1 },
            });
        });

        it('should throw FornecedorNotFound if fornecedor is not found', async () => {
            jest.spyOn(fornecedorRepository, 'findOneOrFail').mockRejectedValue(
                new Error(),
            );

            await expect(service.getById(1)).rejects.toThrow(
                FornecedorNotFound,
            );
        });
    });

    describe('create', () => {
        it('should create a new fornecedor', async () => {
            const fornecedorDto = new FornecedorDto();
            fornecedorDto.name = 'Fornecedor C';
            fornecedorDto.cnpj = '789';
            fornecedorDto.pais = 'Chile';

            jest.spyOn(fornecedorRepository, 'save').mockResolvedValue(
                fornecedorDto,
            );

            const result = await service.create(fornecedorDto);

            expect(result).toEqual(fornecedorDto);
            expect(fornecedorRepository.save).toHaveBeenCalledWith(
                fornecedorDto,
            );
        });
    });

    describe('update', () => {
        it('should update an existing fornecedor', async () => {
            const fornecedorMock = new Fornecedor();
            fornecedorMock.id = 1;

            const fornecedorDto = new FornecedorDto();
            fornecedorDto.name = 'Fornecedor Atualizado';

            jest.spyOn(fornecedorRepository, 'findOneBy').mockResolvedValue(
                fornecedorMock,
            );
            jest.spyOn(fornecedorRepository, 'save').mockResolvedValue(
                fornecedorMock,
            );

            const result = await service.update(1, fornecedorDto);

            expect(result).toEqual(fornecedorMock);
            expect(fornecedorRepository.save).toHaveBeenCalledWith(
                fornecedorMock,
            );
        });

        it('should throw FornecedorNotFound if fornecedor is not found', async () => {
            jest.spyOn(fornecedorRepository, 'findOneBy').mockResolvedValue(
                null,
            );

            await expect(
                service.update(1, new FornecedorDto()),
            ).rejects.toThrow(FornecedorNotFound);
        });
    });

    describe('delete', () => {
        it('should delete a fornecedor by ID', async () => {
            const fornecedorMock = new Fornecedor();
            fornecedorMock.id = 1;

            jest.spyOn(fornecedorRepository, 'findOneBy').mockResolvedValue(
                fornecedorMock,
            );
            jest.spyOn(fornecedorRepository, 'delete').mockResolvedValue(null);

            await expect(service.delete(1)).resolves.toBeUndefined();
        });

        it('should throw FornecedorNotFound if fornecedor is not found', async () => {
            jest.spyOn(fornecedorRepository, 'findOneBy').mockResolvedValue(
                null,
            );

            await expect(service.delete(1)).rejects.toThrow(FornecedorNotFound);
        });
    });
});
