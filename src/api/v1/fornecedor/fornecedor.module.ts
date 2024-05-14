import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import Fornecedor from './core/entity/fornecedor.entity';
import FornecedorService from './core/service/fornecedor.service';
import FornecedorController from './web/controller/fornecedor.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Fornecedor])],
    controllers: [FornecedorController],
    providers: [FornecedorService],
})
export default class FornecedorModule {}
