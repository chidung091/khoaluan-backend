import { Class } from 'src/modules/class/entity/class.entity'
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  JoinColumn,
  OneToOne,
  RelationId,
  OneToMany,
} from 'typeorm'
import { Status } from '../mark.enum'
import { MarkDetail } from './mark-detail.entity'

@Entity()
export class Mark {
  @PrimaryGeneratedColumn()
  markId: number

  @OneToOne(() => Class)
  @JoinColumn()
  class: Class

  @RelationId((cla: Mark) => cla.class)
  classClassId: number

  @Column()
  semester: number

  @Column()
  startYear: number

  @Column()
  endYear: number

  @Column({ type: 'enum', enum: Status })
  status: Status

  @OneToMany(() => MarkDetail, (project) => project.mark)
  markDetail: MarkDetail[]

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  createdAt: Date

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  updatedAt: Date
}
