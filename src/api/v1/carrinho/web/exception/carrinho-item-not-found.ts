import { NotFoundException } from '@nestjs/common';

export default class CarrinhoItemNotFound extends NotFoundException {
    constructor(id: number) {
        super('Item do carrinho não encontrado para o carrinho id: ' + id);
    }
}
