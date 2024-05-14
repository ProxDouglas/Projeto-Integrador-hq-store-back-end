import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import Collection from '../entity/collection.entity';
import { DataSource, Repository } from 'typeorm';
import CollectionCreateDto from '../../web/dto/collection_create.dto';
import CollectionCreateMapper from '../../web/mapper/collection_create.mapper';
import CollectionUpdateDto from '../../web/dto/collection_update.dto';
import CollectionNotFound from '../../web/exception/collection-not-found';
import Comics from 'src/api/v1/comics/core/entity/comics.entity';
import ComicsAssociateDto from 'src/api/v1/comics/web/dto/comics-associate.dto';
import ResponseException from 'src/api/v1/exception/response.exception';

@Injectable()
export default class CollectionService {
    private readonly collectionCreateMapper: CollectionCreateMapper;

    constructor(
        @InjectRepository(Comics)
        private readonly comicsRepository: Repository<Comics>,
        @InjectRepository(Collection)
        private readonly collectionRepository: Repository<Collection>,
        collectionCreateMapper: CollectionCreateMapper,
        @InjectDataSource()
        private readonly dataSource: DataSource,
    ) {
        this.collectionCreateMapper = collectionCreateMapper;
    }

    list(): Promise<Collection[]> {
        return this.collectionRepository.find();
    }

    create(
        collectionCreateDto: CollectionCreateDto,
    ): Promise<CollectionCreateDto> {
        return this.collectionRepository
            .save(this.collectionCreateMapper.toEntity(collectionCreateDto))
            .then((collection) =>
                this.collectionCreateMapper.toDto(collection),
            );
    }

    addComics(id: number, comicsAssociate: ComicsAssociateDto[]) {
        return this.dataSource
            .getRepository('hq_colecao')
            .createQueryBuilder('hq_colecao')
            .insert()
            .values(
                comicsAssociate.map((comics) => ({
                    hq_id: comics.id,
                    colecao_id: id,
                })),
            )
            .execute()
            .catch((error) => {
                console.error(error);
                return Promise.reject(
                    new ResponseException(
                        500,
                        'Não foi possivel associar as hqs as coleções!',
                    ),
                );
            });
    }

    update(
        id: number,
        collectionCreateDto: CollectionUpdateDto,
    ): Promise<CollectionUpdateDto> {
        return this.collectionRepository
            .findOneByOrFail({
                id,
            })
            .then((collection) => {
                collection.name = collectionCreateDto.name;
                collection.description = collectionCreateDto.description;
                return this.collectionRepository.save(collection);
            })
            .catch((error) => {
                console.log(error);
                return Promise.reject(new CollectionNotFound(id));
            });
    }

    delete(id: number): Promise<boolean> {
        return this.collectionRepository
            .findOneByOrFail({
                id,
            })
            .then((collection) => this.collectionRepository.delete(collection))
            .then(() => true)
            .catch((error) => {
                console.log(error);
                return Promise.reject(new CollectionNotFound(id));
            });
    }
}
