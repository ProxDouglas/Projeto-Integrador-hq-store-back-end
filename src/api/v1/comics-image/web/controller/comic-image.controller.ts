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
import ResponseStatusSave from '../../../response-status/response-status-save';
import ResponseStatusDefault from '../../../response-status/response-status-default';
import ComicsImageNotFound from '../exception/comics-image-not-found';
import { FileSizeValidationPipe } from '../Pipe/file-size.pipe';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import CreateComicsImageDto from '../dto/create-comic-image.dto';
@ApiTags('images')
@Controller('/api/comics/images')
export default class ComicsImageController {
    private readonly comicsImageService: ComicsImageService;

    constructor(comicsImageService: ComicsImageService) {
        this.comicsImageService = comicsImageService;
    }

    @Get(':id')
    async getById(@Param('id', ParseIntPipe) id: number): Promise<string> {
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
        comicsImage: Array<CreateComicsImageDto>,
    ): Promise<ResponseStatusSave> {
        return this.comicsImageService
            .create(id, comicsImage)
            .then(() => new ResponseStatusSave());
    }

    @Delete(':id')
    async delete(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<ResponseStatusDefault> {
        return this.comicsImageService.delete(id).then((deleted) => {
            if (deleted === false) throw new ComicsImageNotFound(id);
            return new ResponseStatusDefault();
        });
    }
}
