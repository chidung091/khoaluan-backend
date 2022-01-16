import { Department } from 'src/modules/department/entity/department.entity'
import { Users } from 'src/modules/users/entity/users.entity'
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  JoinColumn,
  ManyToOne,
  RelationId,
  OneToOne,
} from 'typeorm'

@Entity()
export class Teachers {
  @PrimaryGeneratedColumn()
  teacherId: number

  @Column({ type: 'nvarchar', length: '100' })
  teacherName: string

  @Column()
  teacherNumber: number

  @ManyToOne(() => Department, (department) => department.teachers)
  @JoinColumn()
  teacherDepartment: Department

  @RelationId((cla: Teachers) => cla.teacherDepartment)
  teacherDepartmentDepartmentId: number

  @OneToOne(() => Users)
  @JoinColumn()
  teacherUsers: Users

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
