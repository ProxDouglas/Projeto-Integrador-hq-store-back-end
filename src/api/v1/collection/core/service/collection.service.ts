import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Collection from '../entity/collection.entity';
import { Repository } from 'typeorm';

@Injectable()
export default class CollectionService {
    constructor(
        @InjectRepository(Collection)
        private readonly collectionRepository: Repository<Collection>,
    ) {}

    list(): Promise<Collection[]> {
        return this.collectionRepository.find();
    }
}
