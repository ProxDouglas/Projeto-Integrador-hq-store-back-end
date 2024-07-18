import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import Carrinho from './core/entity/carrinho.entity';
import CarrinhoItem from './core/entity/carrinho-item.entity';
import CarrinhoController from './web/controller/carrinho.controller';
import CarrinhoService from './core/service/carrinho.service';



@Module({
    imports: [TypeOrmModule.forFeature([Carrinho, CarrinhoItem])],
    controllers: [CarrinhoController],
    providers: [CarrinhoService],
})
export default class CarrinhoModule {}
