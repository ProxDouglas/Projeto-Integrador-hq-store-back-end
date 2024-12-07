import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Autor from '../entity/autor.entity';
import AutorDto from '../../web/dto/autor.dto';
import AutorNotFound from '../../web/exception/autor-not-found';

@Injectable()
export default class AutorService {
    constructor(
        @InjectRepository(Autor)
        private readonly autorRepository: Repository<Autor>,
        // private readonly autorMapper: AutorMapper,
    ) {}

    async list(): Promise<Autor[]> {
        return this.autorRepository.find();
    }

    async getById(id: number): Promise<Autor> {
        return this.autorRepository
            .findOneOrFail({
                where: { id: id },
            })
            .catch(() => Promise.reject(new AutorNotFound(id)));
    }

    public async create(autorDto: AutorDto): Promise<AutorDto> {
        return this.autorRepository.save(autorDto);
    }

    public async update(id: number, autorDto: AutorDto): Promise<AutorDto> {
        return await this.autorRepository
            .findOneBy({ id })
            .then((autor) => {
                if (autorDto.nome) autor.nome = autorDto.nome;

                return this.autorRepository.save(autor);
            })
            .catch(() => Promise.reject(new AutorNotFound(id)));
    }

    public async delete(id: number) {
        this.autorRepository
            .findOneBy({ id })
            .then((autor) => this.autorRepository.delete(autor));
    }
}
