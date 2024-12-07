import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Apreciador from '../entity/apreciador.entity';
import ApreciadorDto from '../../web/dto/apreciador.dto';
import ApreciadorNotFound from '../../web/exception/apreciador-not-found';

@Injectable()
export default class ApreciadorService {
    constructor(
        @InjectRepository(Apreciador)
        private readonly apreciadorRepository: Repository<Apreciador>,
        // private readonly apreciadorMapper: ApreciadorMapper,
    ) {}

    async list(): Promise<Apreciador[]> {
        return this.apreciadorRepository.find();
    }

    async getById(id: number): Promise<Apreciador> {
        return this.apreciadorRepository
            .findOneOrFail({
                where: { id: id },
            })
            .catch(() => Promise.reject(new ApreciadorNotFound(id)));
    }

    public async create(apreciadorDto: ApreciadorDto): Promise<ApreciadorDto> {
        return this.apreciadorRepository.save(apreciadorDto);
    }

    public async update(
        id: number,
        apreciadorDto: ApreciadorDto,
    ): Promise<ApreciadorDto> {
        return await this.apreciadorRepository
            .findOneBy({ id })
            .then((apreciador) => {
                if (apreciadorDto.nome) apreciador.nome = apreciadorDto.nome;
                if (apreciadorDto.cpf) apreciador.cpf = apreciadorDto.cpf;
                if (apreciadorDto.email) apreciador.email = apreciadorDto.email;
                return this.apreciadorRepository.save(apreciador);
            })
            .catch(() => Promise.reject(new ApreciadorNotFound(id)));
    }

    public async delete(id: number) {
        this.apreciadorRepository
            .findOneBy({ id })
            .then((apreciador) => this.apreciadorRepository.delete(apreciador));
    }
}
