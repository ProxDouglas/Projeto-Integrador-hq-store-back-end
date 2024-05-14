import { NotFoundException } from '@nestjs/common';

export default class FornecedorImageNotFound extends NotFoundException {
    constructor(id: number) {
        super('Fornecedor não encontrado com id: ' + id);
    }
}
