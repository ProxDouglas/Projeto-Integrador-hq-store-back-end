import { Test, TestingModule } from '@nestjs/testing';
import ComicsImageController from './comic-image.controller';
import ComicsImageService from '../../core/service/comic-image.service';
import ComicsImageNotFound from '../exception/comics-image-not-found';
import ResponseStatusDefault from '../../../response-status/response-status-default';

describe('ComicsImageController', () => {
    let controller: ComicsImageController;
    let service: ComicsImageService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [ComicsImageController],
            providers: [
                {
                    provide: ComicsImageService,
                    useValue: {
                        getById: jest.fn(),
                        create: jest.fn(),
                        delete: jest.fn(),
                    },
                },
            ],
        }).compile();

        controller = module.get<ComicsImageController>(ComicsImageController);
        service = module.get<ComicsImageService>(ComicsImageService);
    });

    describe('getById', () => {
        it('should return the URL of a comic image by ID', async () => {
            const imageUrl = 'http://example.com/image.jpg';
            jest.spyOn(service, 'getById').mockResolvedValue(imageUrl);

            const result = await controller.getById(1);

            expect(result).toBe(imageUrl);
            expect(service.getById).toHaveBeenCalledWith(1);
        });

        it('should throw ComicsImageNotFound if the image is not found', async () => {
            jest.spyOn(service, 'getById').mockRejectedValue(
                new ComicsImageNotFound(1),
            );

            await expect(controller.getById(1)).rejects.toThrow(
                ComicsImageNotFound,
            );
        });
    });

    // describe('uploadFile', () => {
    //     it('should upload a comic image and return a success response', async () => {
    //         const mockDto = [
    //             { fileName: 'image.jpg', size: 500, mimeType: 'image/jpeg' },
    //         ] as unknown as Array<CreateComicsImageDto>;
    //         jest.spyOn(service, 'getById').mockResolvedValue(undefined);

    //         const result = await controller.uploadFile(1, mockDto);

    //         expect(result).toBeInstanceOf(ResponseStatusSave);
    //         expect(service.create).toHaveBeenCalledWith(1, mockDto);
    //     });
    // });

    describe('delete', () => {
        it('should delete a comic image and return a success response', async () => {
            jest.spyOn(service, 'delete').mockResolvedValue(true);

            const result = await controller.delete(1);

            expect(result).toBeInstanceOf(ResponseStatusDefault);
            expect(service.delete).toHaveBeenCalledWith(1);
        });

        it('should throw ComicsImageNotFound if the image to delete is not found', async () => {
            jest.spyOn(service, 'delete').mockResolvedValue(false);

            await expect(controller.delete(1)).rejects.toThrow(
                ComicsImageNotFound,
            );
        });
    });
});
