import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Collection from '../entity/collection.entity';
import { Repository } from 'typeorm';
import CollectionCreateDto from '../../web/dto/collection_create.dto';
import CollectionCreateMapper from '../../web/mapper/collection_create.mapper';

@Injectable()
export default class CollectionService {
    private readonly collectionCreateMapper: CollectionCreateMapper;

    constructor(
        @InjectRepository(Collection)
        private readonly collectionRepository: Repository<Collection>,
        collectionCreateMapper: CollectionCreateMapper,
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
}
