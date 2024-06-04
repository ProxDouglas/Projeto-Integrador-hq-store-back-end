import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import Carrinho from '../entity/carrinho.entity';
import { DataSource, Repository } from 'typeorm';
// import CarrinhoCreateDto from '../../web/dto/carrinho_create.dto';
// import CarrinhoUpdateDto from '../../web/dto/carrinho_update.dto';
// import CarrinhoNotFound from '../../web/exception/carrinho-not-found';
// import Comics from 'src/api/v1/comics/core/entity/comics.entity';
// import ComicsAssociateDto from 'src/api/v1/comics/web/dto/comics-associate.dto';
// import ResponseException from 'src/api/v1/exception/response.exception';

@Injectable()
export default class CarrinhoService {
    constructor(
        // @InjectRepository(Comics)
        // private readonly comicsRepository: Repository<Comics>,
        @InjectRepository(Carrinho)
        private readonly carrinhoRepository: Repository<Carrinho>,
        @InjectDataSource()
        private readonly dataSource: DataSource,
    ) {}

    list(apreciador_id: number): Promise<Carrinho[]> {
        return this.carrinhoRepository.find({
            where: { apreciador_id: apreciador_id },
        });
    }

    /*
    getById(id: number): Promise<Carrinho> {
        return this.carrinhoRepository.findOneOrFail({
            where: { id },
        });
    }

    create(
        carrinhoCreateDto: CarrinhoCreateDto,
    ): Promise<CarrinhoCreateDto> {
        return this.carrinhoRepository
            .save(this.carrinhoCreateMapper.toEntity(carrinhoCreateDto))
            .then((carrinho) =>
                this.carrinhoCreateMapper.toDto(carrinho),
            );
    }

    addComics(id: number, comicsAssociateDto: ComicsAssociateDto[]) {
        return this.dataSource
            .getRepository('hq_colecao')
            .createQueryBuilder('hq_colecao')
            .insert()
            .values(
                comicsAssociateDto.map((comics) => ({
                    hq_id: comics.id,
                    colecao_id: id,
                })),
            )
            .execute()
            .catch((error) => {
                console.error(error);
                return Promise.reject(
                    new ResponseException(
                        500,
                        'Não foi possivel associar a hq a coleção!',
                    ),
                );
            });
    }

    removeComics(id: number, comics_id: number) {
        return this.dataSource
            .getRepository('hq_colecao')
            .createQueryBuilder('hq_colecao')
            .delete()
            .where('userId = :hq_id AND colecao_id = :roleId', {
                hq_id: comics_id,
                colecao_id: id,
            })
            .execute()
            .catch((error) => {
                console.error(error);
                return Promise.reject(
                    new ResponseException(
                        500,
                        'Não foi possivel desassociar a hq a coleção!',
                    ),
                );
            });
    }

    update(
        id: number,
        carrinhoCreateDto: CarrinhoUpdateDto,
    ): Promise<CarrinhoUpdateDto> {
        return this.carrinhoRepository
            .findOneByOrFail({
                id,
            })
            .then((carrinho) => {
                carrinho.name = carrinhoCreateDto.name;
                carrinho.description = carrinhoCreateDto.description;
                return this.carrinhoRepository.save(carrinho);
            })
            .catch((error) => {
                console.log(error);
                return Promise.reject(new CarrinhoNotFound(id));
            });
    }

    delete(id: number): Promise<boolean> {
        return this.carrinhoRepository
            .findOneOrFail({
                where: { id },
                select: { id: true },
            })
            .then((carrinho) => this.carrinhoRepository.delete(carrinho))
            .then(() => true)
            .catch((error) => {
                console.log(error);
                return Promise.reject(new CarrinhoNotFound(id));
            });
    }
*/
}
