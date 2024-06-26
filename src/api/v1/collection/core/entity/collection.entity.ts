import {
    Column,
    Entity,
    JoinTable,
    ManyToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Length, IsNotEmpty } from 'class-validator';
import Comics from '../../../comics/core/entity/comics.entity';

@Entity({ name: 'colecao' })
export default class Collection {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Length(2, 155)
    @IsNotEmpty()
    @Column({ name: 'nome', nullable: false })
    name: string;

    @Length(0, 700)
    @Column({ name: 'descricao', nullable: true })
    description: string;

    @ManyToMany(() => Comics)
    @JoinTable({
        name: 'hq_colecao',
        joinColumn: { name: 'colecao_id', referencedColumnName: 'id' },
        inverseJoinColumn: {
            name: 'hq_id',
            referencedColumnName: 'id',
        },
    })
    comics: Comics[];
}
