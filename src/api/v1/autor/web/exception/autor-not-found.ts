import { NotFoundException } from '@nestjs/common';

export default class AutorImageNotFound extends NotFoundException {
    constructor(id: number) {
        super('Autor não encontrado com id: ' + id);
    }
}
