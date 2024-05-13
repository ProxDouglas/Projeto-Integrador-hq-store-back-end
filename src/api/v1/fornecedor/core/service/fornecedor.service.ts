import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import Fornecedor from '../entity/fornecedor.entity';
import FornecedorDto from '../../web/dto/fornecedor.dto';
import FornecedorNotFound from '../../web/exception/fornecedor-not-found';

@Injectable()
export default class FornecedorService {
    constructor(
        @InjectRepository(Fornecedor)
        private readonly fornecedorRepository: Repository<Fornecedor>,
        // private readonly fornecedorMapper: FornecedorMapper,
    ) {}

    async list(): Promise<Fornecedor[]> {
        return this.fornecedorRepository.find();
    }

    public async create(fornecedorDto: FornecedorDto): Promise<FornecedorDto> {
        return this.fornecedorRepository.save(fornecedorDto);
    }

    public async update(id: number, fornecedorDto: FornecedorDto): Promise<FornecedorDto> {
        return await this.fornecedorRepository
            .findOneBy({ id })
            .then((fornecedor) => {
                if (fornecedorDto.name) fornecedor.name = fornecedorDto.name;

                if (fornecedorDto.cnpj)
                    fornecedor.cnpj = fornecedorDto.cnpj;

                if (fornecedorDto.pais)
                    fornecedor.pais = fornecedorDto.pais;

                return this.fornecedorRepository.save(fornecedor);
            })
            .catch(() => {
                throw new FornecedorNotFound(id);
            });
    }

    public async delete(id: number) {
        this.fornecedorRepository
            .findOneBy({ id })
            .then((fornecedor) => this.fornecedorRepository.delete(fornecedor));
    }
}
