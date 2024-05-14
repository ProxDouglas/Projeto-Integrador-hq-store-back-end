import { NotFoundException } from '@nestjs/common';

export default class CollectionNotFound extends NotFoundException {
    constructor(id: number) {
        super('Collection not found with id: ' + id);
    }
}
