import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Fornecedor from '../entity/fornecedor.entity';
import FornecedorDto from '../../web/dto/fornecedor.dto';
import FornecedorNotFound from '../../web/exception/fornecedor-not-found';
import ResponseException from '../../../exception/response.exception';

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

    async getById(id: number): Promise<Fornecedor> {
        return this.fornecedorRepository
            .findOneOrFail({
                where: { id: id },
            })
            .catch(() => Promise.reject(new FornecedorNotFound(id)));
    }

    public async create(fornecedorDto: FornecedorDto): Promise<FornecedorDto> {
        return this.fornecedorRepository.save(fornecedorDto);
    }

    public async update(
        id: number,
        fornecedorDto: FornecedorDto,
    ): Promise<FornecedorDto> {
        return await this.fornecedorRepository
            .findOneByOrFail({ id })
            .then((fornecedor) => {
                if (fornecedorDto.name) fornecedor.name = fornecedorDto.name;

                if (fornecedorDto.cnpj) fornecedor.cnpj = fornecedorDto.cnpj;

                if (fornecedorDto.pais) fornecedor.pais = fornecedorDto.pais;

                return this.fornecedorRepository.save(fornecedor);
            })
            .catch(() => Promise.reject(new FornecedorNotFound(id)));
    }

    public async delete(id: number) {
        let fornecedor = null;
        try {
            fornecedor = await this.fornecedorRepository.findOneByOrFail({
                id,
            });
        } catch (error) {
            return Promise.reject(new FornecedorNotFound(id));
        }

        try {
            return await this.fornecedorRepository.delete(fornecedor);
        } catch (error) {
            return Promise.reject(
                new ResponseException(500, 'Não foi possivel deletar!'),
            );
        }
    }
}
