import { NotFoundException } from '@nestjs/common';

export default class ApreciadorImageNotFound extends NotFoundException {
    constructor(id: number) {
        super('Apreciador(a) não encontrado(a) com id: ' + id);
    }
}
