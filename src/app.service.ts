import { Injectable } from '@nestjs/common'

@Injectable()
export class AppService {
  getHello(): string {
    return 'Đây là api khoá luận của Thanh Huyền'
  }
}
