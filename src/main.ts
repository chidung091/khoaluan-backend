import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { PORT, MICROSERVICE_HOST } from './config/secrets'
import { INestApplication, ValidationPipe } from '@nestjs/common'
import { HttpExceptionFilter } from './filters'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { Transport } from '@nestjs/microservices'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.setGlobalPrefix('/api/training')
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  )
  app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      host: MICROSERVICE_HOST,
      port: 4003,
    },
  })
  app.useGlobalFilters(new HttpExceptionFilter())
  setUpSwagger(app)
  app.enableCors()
  await app.startAllMicroservices()
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

  SwaggerModule.setup('/api/training/docs', app, document, {
    swaggerOptions: {
      displayOperationId: true,
    },
    customSiteTitle: 'Point Training System',
  })
}

bootstrap()
