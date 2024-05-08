import {
    Controller,
    Get,
    Post,
    Delete,
    Param,
    ParseIntPipe,
    UseInterceptors,
    UploadedFiles,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import ComicsImageService from '../../core/service/comic-image.service';
import ComicsImage from '../../core/entity/comic-image.entity';
import ResponseStatusSave from 'src/api/v1/response-status/response-status-save';
import ResponseStatusDelete from 'src/api/v1/response-status/response-status-delete';
import ComicsImageNotFound from '../exception/comics-image-not-found';
import { FileSizeValidationPipe } from '../Pipe/file-size.pipe';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
@ApiTags('images')
@Controller('/api/comics/images')
export default class ComicsImageController {
    private readonly comicsImageService: ComicsImageService;

    constructor(comicsImageService: ComicsImageService) {
        this.comicsImageService = comicsImageService;
    }

    // @Get(':comics_id')
    // async list(
    //     @Param('comics_id', ParseIntPipe) comics_id: number,
    // ): Promise<ComicsImage[]> {
    //     return this.comicsImageService.list(comics_id);
    // }

    @Get('by/:id')
    async getById(@Param('id', ParseIntPipe) id: number): Promise<ComicsImage> {
        return this.comicsImageService.getById(id);
    }

    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                file: { type: 'string', format: 'binary' },
            },
        },
    })
    @Post(':id')
    @UseInterceptors(FilesInterceptor('file'))
    async uploadFile(
        @Param('id', ParseIntPipe)
        id: number,
        @UploadedFiles(new FileSizeValidationPipe())
        comicsImage: Array<ComicsImage>,
    ): Promise<ResponseStatusSave> {
        return this.comicsImageService
            .create(id, comicsImage)
            .then(() => new ResponseStatusSave());
    }

    @Delete(':id')
    async delete(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<ResponseStatusDelete> {
        return this.comicsImageService.delete(id).then((deleted) => {
            if (deleted === false) throw new ComicsImageNotFound(id);
            return new ResponseStatusDelete();
        });
    }
}
