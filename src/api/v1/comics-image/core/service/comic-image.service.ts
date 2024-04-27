import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import ComicsImage from '../entity/comic-image.entity';
import Comics from 'src/api/v1/comics/core/entity/comics.entity';
import ComicsNotFound from 'src/api/v1/comics/web/exception/comics-not-found';

@Injectable()
export default class ComicsImageService {
    constructor(
        @InjectRepository(ComicsImage)
        private readonly comicsImageRepository: Repository<ComicsImage>,
        @InjectRepository(ComicsImage)
        private readonly comicsRepository: Repository<Comics>,
    ) {}

    public list(comics_id: number): Promise<ComicsImage[]> {
        return this.comicsImageRepository.find({
            where: [{ comics: { id: comics_id } }],
        });
    }

    public getById(id: number): Promise<ComicsImage> {
        return this.comicsImageRepository
            .findOneByOrFail({ id: id })
            .catch(() => {
                throw new NotFoundException('Comics image not Found!');
            });
    }

    public create(id: number, comicsImage: ComicsImage[]): Promise<boolean> {
        return this.comicsRepository
            .findOne({
                where: { id: id },
                select: { id: true },
            })
            .then((comics) => {
                comicsImage.forEach((file) => {
                    file.comics = comics;
                });

                return this.comicsImageRepository
                    .save(comicsImage)
                    .then(() => true);
            })
            .catch(() => {
                throw new ComicsNotFound(id);
            });
    }

    public delete(id: number): Promise<boolean> {
        return this.comicsImageRepository.delete(id).then(({ affected }) => {
            if (affected === 0) return false;
            return true;
        });
    }
}
