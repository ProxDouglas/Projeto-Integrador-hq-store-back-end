import { Test, TestingModule } from '@nestjs/testing';
import FilterFactory from './filter-factory';
import FilterName from './filter-types/filter-name';
import FilterAgePublication from './filter-types/filter-age-publication';
import FilterCollection from './filter-types/filter-collection';
import FilterEmpty from './filter-types/filter-empty';
import { TypeFinder } from '../enum/TypeFinder';
import FilterTypes from './interface/filter-types';

describe('FilterFactory', () => {
    let filterFactory: FilterFactory;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [FilterFactory],
        }).compile();

        filterFactory = module.get<FilterFactory>(FilterFactory);
    });

    it('should be defined', () => {
        expect(filterFactory).toBeDefined();
    });

    it('should return FilterName for TypeFinder.NAME', () => {
        const result: FilterTypes = filterFactory.build(TypeFinder.NAME);
        expect(result).toBeInstanceOf(FilterName);
    });

    it('should return FilterAgePublication for TypeFinder.YEAR_PUBLICATION', () => {
        const result: FilterTypes = filterFactory.build(
            TypeFinder.YEAR_PUBLICATION,
        );
        expect(result).toBeInstanceOf(FilterAgePublication);
    });

    it('should return FilterCollection for TypeFinder.COLLECTION', () => {
        const result: FilterTypes = filterFactory.build(TypeFinder.COLLECTION);
        expect(result).toBeInstanceOf(FilterCollection);
    });

    it('should return FilterEmpty for unknown TypeFinder', () => {
        const result: FilterTypes = filterFactory.build(undefined);
        expect(result).toBeInstanceOf(FilterEmpty);
    });
});
