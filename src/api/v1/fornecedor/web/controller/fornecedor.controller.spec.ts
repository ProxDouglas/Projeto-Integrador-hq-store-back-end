import { Test, TestingModule } from '@nestjs/testing';
import FornecedorController from './fornecedor.controller';
import FornecedorService from '../../core/service/fornecedor.service';
import FornecedorDto from '../dto/fornecedor.dto';
import Fornecedor from '../../core/entity/fornecedor.entity';
import { NotFoundException } from '@nestjs/common';

describe('FornecedorController', () => {
    let controller: FornecedorController;

    const mockFornecedorService = {
        list: jest.fn(),
        getById: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
    };

    const fornecedorMock: Fornecedor = {
        id: 1,
        name: 'Fornecedor Mock',
        cnpj: '00.000.000/0000-00',
        pais: 'Brasil',
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [FornecedorController],
            providers: [
                {
                    provide: FornecedorService,
                    useValue: mockFornecedorService,
                },
            ],
        }).compile();

        controller = module.get<FornecedorController>(FornecedorController);
    });

    describe('list', () => {
        it('should return an array of fornecedores', async () => {
            mockFornecedorService.list.mockResolvedValue([fornecedorMock]);

            const result = await controller.list();

            expect(result).toEqual([fornecedorMock]);
            expect(mockFornecedorService.list).toHaveBeenCalled();
        });
    });

    describe('getById', () => {
        it('should return a fornecedor by ID', async () => {
            mockFornecedorService.getById.mockResolvedValue(fornecedorMock);

            const result = await controller.getById(1);

            expect(result).toEqual(fornecedorMock);
            expect(mockFornecedorService.getById).toHaveBeenCalledWith(1);
        });

        it('should throw NotFoundException if fornecedor is not found', async () => {
            mockFornecedorService.getById.mockRejectedValue(
                new NotFoundException(),
            );

            await expect(controller.getById(1)).rejects.toThrow(
                NotFoundException,
            );
        });
    });

    describe('create', () => {
        it('should create a new fornecedor', async () => {
            const fornecedorDto: FornecedorDto = {
                id: 1,
                name: 'New Fornecedor',
                cnpj: '00.000.000/0000-01',
                pais: 'Brasil',
            };

            mockFornecedorService.create.mockResolvedValue(fornecedorDto);

            const result = await controller.create(fornecedorDto);

            expect(result).toEqual(fornecedorDto);
            expect(mockFornecedorService.create).toHaveBeenCalledWith(
                fornecedorDto,
            );
        });
    });

    describe('update', () => {
        it('should update a fornecedor by ID', async () => {
            const fornecedorDto: FornecedorDto = {
                id: 1,
                name: 'Updated Fornecedor',
                cnpj: '00.000.000/0000-01',
                pais: 'Argentina',
            };

            mockFornecedorService.update.mockResolvedValue(fornecedorDto);

            const result = await controller.update(1, fornecedorDto);

            expect(result).toEqual(fornecedorDto);
            expect(mockFornecedorService.update).toHaveBeenCalledWith(
                1,
                fornecedorDto,
            );
        });

        it('should throw NotFoundException if fornecedor is not found', async () => {
            const fornecedorDto: FornecedorDto = {
                id: 1,
                name: 'Updated Fornecedor',
                cnpj: '00.000.000/0000-01',
                pais: 'Argentina',
            };

            mockFornecedorService.update.mockRejectedValue(
                new NotFoundException(),
            );

            await expect(controller.update(1, fornecedorDto)).rejects.toThrow(
                NotFoundException,
            );
        });
    });

    describe('delete', () => {
        it('should return fornecedor when deleting by ID', async () => {
            mockFornecedorService.getById.mockResolvedValue(fornecedorMock);

            const result = await controller.delete(1);

            expect(result).toEqual(fornecedorMock);
            expect(mockFornecedorService.getById).toHaveBeenCalledWith(1);
        });

        it('should throw NotFoundException if fornecedor is not found', async () => {
            mockFornecedorService.getById.mockRejectedValue(
                new NotFoundException(),
            );

            await expect(controller.delete(1)).rejects.toThrow(
                NotFoundException,
            );
        });
    });
});
