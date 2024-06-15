import {
    Column,
    Entity,
    JoinColumn,
    OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import Comics from '../../../comics/core/entity/comics.entity';

@Entity({ name: 'hq_imagem' })
export default class ComicsImage {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({ name: 'nome_minio', type: 'varchar', nullable: true })
    name: string;

    url: string;

    @Column({ name: 'hq_id', type: 'integer', nullable: false })
    comics_id: number;

    @OneToOne(() => Comics, (comics) => comics.image)
    @JoinColumn({ name: 'hq_id', referencedColumnName: 'id' })
    comics: Comics;
}
