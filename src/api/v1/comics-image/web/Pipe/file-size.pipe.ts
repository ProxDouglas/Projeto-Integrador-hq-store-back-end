import {
    PipeTransform,
    Injectable,
    ArgumentMetadata,
    BadRequestException,
} from '@nestjs/common';
import CreateComicsImageDto from '../dto/create-comic-image.dto';

@Injectable()
export class FileSizeValidationPipe implements PipeTransform {
    transform(
        listCreateComicsImageDto: CreateComicsImageDto[],
        metadata: ArgumentMetadata,
    ) {
        const oneKb = 2000000;

        if (listCreateComicsImageDto.length === 0)
            throw new BadRequestException(
                'No file was provided for registration.',
            );

        const validos: boolean = listCreateComicsImageDto.some(
            (createComicsImageDto) => {
                if (createComicsImageDto.size > oneKb) return false;
                if (
                    createComicsImageDto.mimetype !== 'image/jpeg' &&
                    createComicsImageDto.mimetype !== 'image/png' &&
                    createComicsImageDto.mimetype !== 'image/webp'
                )
                    return false;

                return true;
            },
        );

        if (validos === false)
            throw new BadRequestException(
                'The files need to be in PNG or JPEG format and be less than 2MB',
            );

        return listCreateComicsImageDto;
    }
}
