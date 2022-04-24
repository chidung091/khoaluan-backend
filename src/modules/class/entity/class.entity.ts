import { Course } from 'src/modules/course/entity/course.entity'
import { Department } from 'src/modules/department/entity/department.entity'
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
  OneToMany,
} from 'typeorm'

@Entity()
export class Class {
  @PrimaryGeneratedColumn()
  classId: number

  @Column({ type: 'nvarchar', length: '50' })
  className: string

  @ManyToOne(() => Department, (department) => department.classes)
  @JoinColumn()
  classDepartment: Department

  @RelationId((cla: Class) => cla.classDepartment)
  classDepartmentDepartmentId: number

  @Column({ type: 'int' })
  headMasterId: number

  @Column({ type: 'int' })
  monitorId: number

  @ManyToOne(() => Course, (department) => department.classes)
  @JoinColumn()
  classCourse: Course

  @RelationId((cla: Class) => cla.classCourse)
  classCourseCourseId: number

  @OneToMany(() => DetailUsers, (project) => project.usersClass)
  classUsers: DetailUsers[]

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
