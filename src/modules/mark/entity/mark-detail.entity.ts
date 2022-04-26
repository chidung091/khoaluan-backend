import { DetailUsers } from 'src/modules/detail-users/entity/detail-users.entity'
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  JoinColumn,
  ManyToOne,
  RelationId,
} from 'typeorm'
import { Mark } from './mark.entity'

@Entity()
export class MarkDetail {
  @PrimaryGeneratedColumn()
  markDetailId: number

  @Column()
  pointId: string

  @Column({ default: 0 })
  studentScore: number

  @Column({ default: 0 })
  monitorScore: number

  @Column({ default: 0 })
  teacherScore: number

  @ManyToOne(() => Mark, (department) => department.markDetail)
  @JoinColumn()
  mark: Mark

  @RelationId((cla: MarkDetail) => cla.mark)
  markMarkId: number

  @ManyToOne(() => DetailUsers, (department) => department.markDetail)
  @JoinColumn()
  detailUser: DetailUsers

  @RelationId((cla: MarkDetail) => cla.detailUser)
  detailUserId: number

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
