import { ApiProperty } from '@nestjs/swagger';

export default class CarrinhoItemDto {
    @ApiProperty()
    carrinho_id: number;

    @ApiProperty()
    hq_id: number;

    @ApiProperty()
    quantidade: number;
}
