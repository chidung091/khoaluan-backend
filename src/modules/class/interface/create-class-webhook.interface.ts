export interface ICreateClassWebhook {
  classId: number
  courseId: number
  students: IStudents[]
}

export interface IStudents {
  semester: number
  studentsIds: [number]
  headMasterId: number
}
