import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import ComicsImage from '../entity/comic-image.entity';
import Comics from '../../../comics/core/entity/comics.entity';
import ComicsNotFound from '../../../comics/web/exception/comics-not-found';
import AWSConnectorS3 from '../connector/aws-s3.connector';
import ComicsImageDto from '../../web/dto/comic-image.dto';

@Injectable()
export default class ComicsImageService {
    private readonly comicsImageRepository: Repository<ComicsImage>;
    private readonly comicsRepository: Repository<Comics>;
    private readonly s3Connector: AWSConnectorS3;

    constructor(
        @InjectRepository(ComicsImage)
        comicsImageRepository: Repository<ComicsImage>,
        @InjectRepository(Comics)
        comicsRepository: Repository<Comics>,
        s3Connector: AWSConnectorS3,
    ) {
        this.comicsImageRepository = comicsImageRepository;
        this.comicsRepository = comicsRepository;
        this.s3Connector = s3Connector;
    }

    public getById(id: number): Promise<string> {
        return this.comicsImageRepository
            .findOneOrFail({ where: { id: id }, select: { name: true } })
            .then((comicsImage) => this.s3Connector.getFile(comicsImage.name))
            .then((url) => url)
            .catch(() =>
                Promise.reject(
                    new NotFoundException('Comics image not Found!'),
                ),
            );
    }

    public create(
        id: number,
        comicsImageDto: ComicsImageDto[],
    ): Promise<boolean> {
        const today = new Date();
        const comicsImages = new Array<ComicsImage>();

        return this.comicsRepository
            .findOne({
                where: { id: id },
                select: { id: true, name: true },
            })
            .then((comics) => {
                return Promise.all(
                    comicsImageDto.map((file) => {
                        const newComicsImage = new ComicsImage();

                        newComicsImage.comics = comics;
                        newComicsImage.name =
                            'images-' +
                            today.toISOString().split('T')[0] +
                            '-' +
                            comics.name.replaceAll(' ', '_') +
                            '-' +
                            comicsImageDto[0].originalname.replaceAll(' ', '_');

                        comicsImages.push(newComicsImage);

                        return this.s3Connector
                            .saveFile(newComicsImage.name, file.buffer)
                            .then((data) => data);
                    }),
                );
            })
            .then((s3Data) => {
                return Promise.all(
                    s3Data.map(() => {
                        return this.comicsImageRepository
                            .save(comicsImages)
                            .then(() => true);
                    }),
                );
            })
            .then(() => true)
            .catch(() => {
                return Promise.reject(new ComicsNotFound(id));
            });
    }

    public delete(id: number): Promise<boolean> {
        return this.comicsImageRepository.delete(id).then(({ affected }) => {
            if (affected === 0) return false;
            return true;
        });
    }
}
