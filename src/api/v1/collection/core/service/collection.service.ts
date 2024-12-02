import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import Collection from '../entity/collection.entity';
import { DataSource, Repository } from 'typeorm';
import CollectionCreateDto from '../../web/dto/collection_create.dto';
import CollectionCreateMapper from '../../web/mapper/collection_create.mapper';
import CollectionUpdateDto from '../../web/dto/collection_update.dto';
import CollectionNotFound from '../../web/exception/collection-not-found';
import ComicsAssociateDto from '../../../comics/web/dto/comics-associate.dto';
import ResponseException from '../../../exception/response.exception';

@Injectable()
export default class CollectionService {
    private readonly collectionCreateMapper: CollectionCreateMapper;

    constructor(
        @InjectRepository(Collection)
        private readonly collectionRepository: Repository<Collection>,
        collectionCreateMapper: CollectionCreateMapper,
        @InjectDataSource()
        private readonly dataSource: DataSource,
    ) {
        this.collectionCreateMapper = collectionCreateMapper;
    }

    getById(id: number): Promise<Collection> {
        return this.collectionRepository
            .findOneOrFail({
                where: { id },
            })
            .catch((error) => {
                console.log(error);
                return Promise.reject(new CollectionNotFound(id));
            });
    }

    // getByComicsName(comicsName: string): Promise<Collection[]> {
    //     return this.collectionRepository
    //         .createQueryBuilder('collections')
    //         .select([
    //             'collections.id',
    //             'collections.name',
    //             'collections.description',
    //         ])
    //         .leftJoin('collections.comics', 'comics_collection', null, [
    //             'comics_collection.id',
    //         ])
    //         .where('comics_collection.name ILIKE :name', {
    //             name: '%' + comicsName + '%',
    //         })
    //         .distinct(true)
    //         .limit(40)
    //         .getMany();
    // }

    create(
        collectionCreateDto: CollectionCreateDto,
    ): Promise<CollectionCreateDto> {
        return this.collectionRepository
            .save(this.collectionCreateMapper.toEntity(collectionCreateDto))
            .then((collection) =>
                this.collectionCreateMapper.toDto(collection),
            );
    }

    addComics(id: number, comicsAssociateDto: ComicsAssociateDto[]) {
        return this.dataSource
            .getRepository('hq_colecao')
            .createQueryBuilder('hq_colecao')
            .insert()
            .values(
                comicsAssociateDto.map((comics) => ({
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
                        'Não foi possivel associar a hq a coleção!',
                    ),
                );
            });
    }

    removeComics(id: number, comics_id: number) {
        return this.dataSource
            .getRepository('hq_colecao')
            .createQueryBuilder('hq_colecao')
            .delete()
            .where('userId = :hq_id AND colecao_id = :roleId', {
                hq_id: comics_id,
                colecao_id: id,
            })
            .execute()
            .catch((error) => {
                console.error(error);
                return Promise.reject(
                    new ResponseException(
                        500,
                        'Não foi possivel desassociar a hq a coleção!',
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
            .findOneOrFail({
                where: { id },
                select: { id: true },
            })
            .then((collection) => this.collectionRepository.delete(collection))
            .then(() => true)
            .catch((error) => {
                console.log(error);
                return Promise.reject(new CollectionNotFound(id));
            });
    }
}
