import { NotFoundException } from '@nestjs/common';

export default class ComicsImageNotFound extends NotFoundException {
    constructor(id: number) {
        super('Comics Image not found with id: ' + id);
    }
}
