import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import Carrinho from '../entity/carrinho.entity';
import CarrinhoDto from '../../web/dto/carrinho.dto';
import { DataSource, Repository } from 'typeorm';
import CarrinhoItem from '../entity/carrinho-item.entity';
import CarrinhoNotFound from '../../web/exception/carrinho-not-found';
import CarrinhoItemNotFound from '../../web/exception/carrinho-item-not-found';
import CarrinhoItemDto from '../../web/dto/carrinho-item.dto';

@Injectable()
export default class CarrinhoService {
    constructor(
        // @InjectRepository(Comics)
        // private readonly comicsRepository: Repository<Comics>,
        @InjectRepository(Carrinho)
        private readonly carrinhoRepository: Repository<Carrinho>,
        @InjectDataSource()
        private readonly dataSource: DataSource,
        @InjectRepository(CarrinhoItem)
        private readonly carrinhoItemRepository: Repository<CarrinhoItem>,
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
    */

    public async create(carrinhoDto: CarrinhoDto): Promise<CarrinhoDto> {
        return this.carrinhoRepository.save(carrinhoDto);
    }

    async getById(id: number): Promise<Carrinho> {
        return this.carrinhoRepository
            .findOneOrFail({
                where: { id: id },
                select: {
                    itens: true,
                },
                relations: { itens: true },
            })
            .then(async (carrinho) => {
                return carrinho;
            })
            .catch(() => Promise.reject(new CarrinhoNotFound(id)));
    }

    async addItemCarrinho(carrinhoItemDto: CarrinhoItemDto) {
        let carrinhoApreciador = null;
        try {
            carrinhoApreciador = await this.carrinhoRepository.findOne({
                where: { id: carrinhoItemDto.carrinho_id },
            });
        } catch (error) {
            return Promise.reject(
                new CarrinhoNotFound(carrinhoItemDto.carrinho_id),
            );
        }

        if (!carrinhoApreciador) {
            return Promise.reject(
                new CarrinhoNotFound(carrinhoItemDto.carrinho_id),
            );
        }

        try {
            return await this.carrinhoItemRepository.save({
                carrinho: { id: carrinhoItemDto.carrinho_id },
                comics: { id: carrinhoItemDto.hq_id },
                quantidade: carrinhoItemDto.quantidade,
            });
        } catch (error) {
            return Promise.reject(
                new CarrinhoItemNotFound(carrinhoItemDto.carrinho_id),
            );
        }
    }

    async deleteItemCarrinho(carrinhoItemDto: CarrinhoItemDto) {
        let itemCarrinho = null;
        try {
            itemCarrinho = await this.carrinhoItemRepository.findOne({
                where: {
                    carrinho_id: carrinhoItemDto.carrinho_id,
                    hq_id: carrinhoItemDto.hq_id,
                },
            });
        } catch (error) {
            return Promise.reject(
                new CarrinhoItemNotFound(carrinhoItemDto.carrinho_id),
            );
        }

        if (!itemCarrinho) {
            return Promise.reject(
                new CarrinhoItemNotFound(carrinhoItemDto.carrinho_id),
            );
        }

        try {
            return await this.carrinhoItemRepository.delete({
                carrinho: { id: carrinhoItemDto.carrinho_id },
                comics: { id: carrinhoItemDto.hq_id },
                quantidade: carrinhoItemDto.quantidade,
            });
        } catch (error) {
            return Promise.reject(
                new CarrinhoItemNotFound(carrinhoItemDto.carrinho_id),
            );
        }
    }

    /*
    adicionarItem(carrinho_id: number, carrinhoItem: CarrinhoItem) {
        this.carrinhoRepository
            .find({
                where: { id: carrinho_id },
            })
            .then((carrinho) => {
                if (!carrinho) {
                    this.carrinhoRepository.create({ apreciador_id });
                }
                return this.carrinhoItemRepository.create(carrinhoItem);
            });
        return this.carrinhoRepository
            .create('carrinhoItem')
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

    
    removerItem(id: number, comics_id: number) {
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
