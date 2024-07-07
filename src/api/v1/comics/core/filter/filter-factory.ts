import { Injectable } from '@nestjs/common';
import { TypeFinder } from '../enum/TypeFinder';
import FilterAgePublication from './filter-types/filter-age-publication';
import FilterCollection from './filter-types/filter-collection';
import FilterEmpty from './filter-types/filter-empty';
import FilterName from './filter-types/filter-name';
import FilterTypes from './interface/filter-types';

@Injectable()
export default class FilterFactory {
    build(type: TypeFinder): FilterTypes {
        switch (type) {
            case TypeFinder.NAME:
                return new FilterName();
            case TypeFinder.YEAR_PUBLICATION:
                return new FilterAgePublication();
            case TypeFinder.COLLECTION:
                return new FilterCollection();
            default:
                return new FilterEmpty();
        }
    }
}
