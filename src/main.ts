import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { PORT } from './config/secrets'
import { INestApplication, ValidationPipe } from '@nestjs/common'
import { HttpExceptionFilter } from './filters'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.setGlobalPrefix('/api/')
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  )
  app.useGlobalFilters(new HttpExceptionFilter())
  setUpSwagger(app)
  app.enableCors()
  await app.listen(PORT)
}

function setUpSwagger(app: INestApplication) {
  const options = new DocumentBuilder()
    .setTitle('Point Training System')
    .setDescription(`API specification for Thanh Huyen Point Training System.`)
    .setVersion('0.1.2')
    .addBearerAuth()
    .build()

  const document = SwaggerModule.createDocument(app, options)

  SwaggerModule.setup('/api/docs', app, document, {
    swaggerOptions: {
      displayOperationId: true,
    },
    customSiteTitle: 'Point Training System',
  })
}

bootstrap()
