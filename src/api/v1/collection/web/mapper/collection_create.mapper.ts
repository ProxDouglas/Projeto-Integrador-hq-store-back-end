import { Injectable } from '@nestjs/common';
import CollectionCreateDto from '../dto/collection_create.dto';
import Collection from '../../core/entity/collection.entity';
import Comics from '../../../comics/core/entity/comics.entity';

@Injectable()
export default class CollectionCreateMapper {
    toEntity(collectionCreateDto: CollectionCreateDto): Collection {
        const collection = new Collection();

        collection.id = collectionCreateDto.id;
        collection.name = collectionCreateDto.name;
        collection.description = collectionCreateDto.description;
        if (Array.isArray(collectionCreateDto.comics))
            collection.comics = collectionCreateDto.comics.map((comics) => {
                const newComics = new Comics();
                newComics.id = comics.id;
                return newComics;
            });

        return collection;
    }

    toDto(collection: Collection) {
        const collectionCreateDto = new CollectionCreateDto();

        collectionCreateDto.id = collection.id;
        collectionCreateDto.name = collection.name;
        collectionCreateDto.description = collection.description;
        if (Array.isArray(collection.comics) === true)
            collectionCreateDto.comics = collection.comics.map((comics) => {
                const comicsAssociateDto = new CollectionCreateDto();
                comicsAssociateDto.id = comics.id;
                return comicsAssociateDto;
            });

        return collectionCreateDto;
    }
}
