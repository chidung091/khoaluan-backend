import { Class } from 'src/modules/class/entity/class.entity'
import { MarkDetail } from 'src/modules/mark/entity/mark-detail.entity'
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  OneToOne,
  JoinColumn,
  ManyToOne,
  RelationId,
  OneToMany,
} from 'typeorm'
import { Users } from '../../users/entity/users.entity'

@Entity()
export class DetailUsers {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  birthDate: Date

  @Column()
  name: string

  @Column({ nullable: true })
  imageUrls: string

  @ManyToOne(() => Class, (department) => department.users)
  @JoinColumn()
  usersClass: Class

  @RelationId((cla: DetailUsers) => cla.usersClass)
  usersClassClassId: number

  @OneToOne(() => Users)
  @JoinColumn()
  users: Users

  @RelationId((cla: DetailUsers) => cla.users)
  usersUserID: number

  @OneToMany(() => MarkDetail, (project) => project.detailUser)
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
