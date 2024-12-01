import { DataSource, ObjectLiteral, SelectQueryBuilder } from 'typeorm';

import Comics from '../../entity/comics.entity';
import ComicsPagesDto from '../../../web/dto/comics-pages.dto';

export default class ComicsFilterBuilder {
    private readonly dataSource: DataSource;
    private readonly query: SelectQueryBuilder<Comics>;
    private take: number;
    private skip: number;

    constructor(dataSource: DataSource) {
        this.dataSource = dataSource;

        this.take = 10;
        this.skip = 0;

        this.query = this.dataSource
            .getRepository(Comics)
            .createQueryBuilder('hq')
            .innerJoin('hq.image', 'hq_imagem', null, ['hq_imagem.id'])
            .addSelect(['hq_imagem.id', 'hq_imagem.name']);
    }

    public setTake(take: number): this {
        this.take = take;
        return this;
    }

    public setSkip(skip: number): this {
        this.skip = skip;
        return this;
    }

    public innerJoin(
        property: string,
        alias: string,
        condition?: string,
        parameters?: ObjectLiteral,
    ): this {
        this.query.innerJoin(property, alias, condition, parameters);
        return this;
    }

    public leftJoin(
        property: string,
        alias: string,
        condition?: string,
        parameters?: ObjectLiteral,
    ): this {
        this.query.leftJoin(property, alias, condition, parameters);
        return this;
    }

    public andWhere(condition: string, parameters: ObjectLiteral): this {
        this.query.andWhere(condition, parameters);
        return this;
    }

    public orWhere(condition: string, parameters: ObjectLiteral): this {
        this.query.orWhere(condition, parameters);
        return this;
    }

    public build(): Promise<ComicsPagesDto> {
        return this.query
            .take(this.take)
            .skip(this.skip * this.take)
            .getManyAndCount()
            .then(([comics, comicsQtd]) => {
                const comicsPageDto = new ComicsPagesDto();
                comicsPageDto.comics = comics;
                comicsPageDto.pages = this.calcularPaginas(
                    comicsQtd,
                    this.take,
                );
                return comicsPageDto;
            });
    }

    private calcularPaginas(dividendo: number, divisor: number): number {
        if (divisor === 0) return 1;

        let resultado = dividendo / divisor;
        if (dividendo % divisor !== 0) {
            resultado++;
        }
        return Math.floor(resultado);
    }
}
