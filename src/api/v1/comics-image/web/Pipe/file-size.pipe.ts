import {
    PipeTransform,
    Injectable,
    ArgumentMetadata,
    BadRequestException,
} from '@nestjs/common';
import ComicsImageDto from '../dto/comic-image.dto';

@Injectable()
export class FileSizeValidationPipe implements PipeTransform {
    transform(
        listComicsImageDto: ComicsImageDto[],
        metadata: ArgumentMetadata,
    ) {
        const oneKb = 2000000;

        if (listComicsImageDto.length === 0)
            throw new BadRequestException(
                'No file was provided for registration.',
            );

        const validos: boolean = listComicsImageDto.some((comicsImageDto) => {
            if (comicsImageDto.size > oneKb) return false;
            if (
                comicsImageDto.mimetype !== 'image/jpeg' &&
                comicsImageDto.mimetype !== 'image/png' &&
                comicsImageDto.mimetype !== 'image/webp'
            )
                return false;

            return true;
        });

        if (validos === false)
            throw new BadRequestException(
                'The files need to be in PNG or JPEG format and be less than 2MB',
            );

        return listComicsImageDto;
    }
}
