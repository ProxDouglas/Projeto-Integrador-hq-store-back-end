import { Test, TestingModule } from '@nestjs/testing';
import CollectionCreateMapper from './collection_create.mapper';
import CollectionCreateDto from '../dto/collection_create.dto';
import Collection from '../../core/entity/collection.entity';
import Comics from '../../../comics/core/entity/comics.entity';

describe('CollectionCreateMapper', () => {
    let mapper: CollectionCreateMapper;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [CollectionCreateMapper],
        }).compile();

        mapper = module.get<CollectionCreateMapper>(CollectionCreateMapper);
    });

    describe('toEntity', () => {
        it('should map CollectionCreateDto to Collection entity', () => {
            const dto = new CollectionCreateDto();
            dto.id = 1;
            dto.name = 'Test Collection';
            dto.description = 'Description';
            dto.comics = [{ id: 1 }, { id: 2 }];

            const entity = mapper.toEntity(dto);

            expect(entity).toBeInstanceOf(Collection);
            expect(entity.id).toBe(dto.id);
            expect(entity.name).toBe(dto.name);
            expect(entity.description).toBe(dto.description);
            expect(entity.comics).toHaveLength(2);
            expect(entity.comics[0]).toBeInstanceOf(Comics);
            expect(entity.comics[0].id).toBe(dto.comics[0].id);
        });

        it('should handle empty comics array', () => {
            const dto = new CollectionCreateDto();
            dto.id = 1;
            dto.name = 'Test Collection';
            dto.description = 'Description';
            dto.comics = [];

            const entity = mapper.toEntity(dto);

            expect(entity.comics).toHaveLength(0);
        });

        it('should handle undefined comics field', () => {
            const dto = new CollectionCreateDto();
            dto.id = 1;
            dto.name = 'Test Collection';
            dto.description = 'Description';

            const entity = mapper.toEntity(dto);

            expect(entity.comics).toBeUndefined();
        });
    });

    describe('toDto', () => {
        it('should map Collection entity to CollectionCreateDto', () => {
            const comics1 = new Comics();
            comics1.id = 1;

            const comics2 = new Comics();
            comics2.id = 2;

            const collection = new Collection();
            collection.id = 1;
            collection.name = 'Test Collection';
            collection.description = 'Description';
            collection.comics = [comics1, comics2];

            const dto = mapper.toDto(collection);

            expect(dto).toBeInstanceOf(CollectionCreateDto);
            expect(dto.id).toBe(collection.id);
            expect(dto.name).toBe(collection.name);
            expect(dto.description).toBe(collection.description);
            expect(dto.comics).toHaveLength(2);
            expect(dto.comics[0].id).toBe(comics1.id);
        });

        it('should handle empty comics array', () => {
            const collection = new Collection();
            collection.id = 1;
            collection.name = 'Test Collection';
            collection.description = 'Description';
            collection.comics = [];

            const dto = mapper.toDto(collection);

            expect(dto.comics).toHaveLength(0);
        });

        it('should handle undefined comics field', () => {
            const collection = new Collection();
            collection.id = 1;
            collection.name = 'Test Collection';
            collection.description = 'Description';

            const dto = mapper.toDto(collection);

            expect(dto.comics).toBeUndefined();
        });
    });
});
