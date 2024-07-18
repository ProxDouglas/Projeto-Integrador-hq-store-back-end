import { NotFoundException } from '@nestjs/common';

export default class CarrinhoNotFound extends NotFoundException {
    constructor(id: number) {
        super('Carrinho não encontrado com id: ' + id);
    }
}
