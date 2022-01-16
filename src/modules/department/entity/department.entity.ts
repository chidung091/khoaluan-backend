import { Class } from 'src/modules/class/entity/class.entity'
import { Teachers } from 'src/modules/teachers/entity/teachers.entity'
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
  OneToMany,
} from 'typeorm'

@Entity()
export class Department {
  @PrimaryGeneratedColumn()
  departmentId: number

  @Column({ type: 'nvarchar', length: '50' })
  departmentName: string

  @Column({ type: 'nvarchar', length: '50' })
  information: string

  @ManyToOne(() => Users, (users) => users.departments)
  @JoinColumn()
  departmentAdmin: Users

  @RelationId((depart: Department) => depart.departmentAdmin)
  departmentAdminUserID: number

  @OneToMany(() => Class, (project) => project.classDepartment)
  classes: Class[]

  @OneToMany(() => Teachers, (project) => project.teacherDepartment)
  teachers: Teachers[]

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
