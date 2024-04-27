import { NotFoundException } from '@nestjs/common';

export default class ComicsNotFound extends NotFoundException {
    constructor(id: number) {
        super('Comics not found with id: ' + id);
    }
}
