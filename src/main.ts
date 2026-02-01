import { NestFactory } from "@nestjs/core"
import { ValidationPipe } from "@nestjs/common"
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger"
import { AppModule } from "./app.module"
import { env } from "process"
import * as fs from "fs"

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  // Enable CORS for frontend communication
  app.enableCors({
    origin: [env.FRONTEND_URL], // Allow multiple ports for development
    credentials: true,
  })

  // Enable global validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  )

  const swaggerConfig = new DocumentBuilder()
    .setTitle("CRM Backend API")
    .setDescription("API documentation for the CRM backend application. This API provides endpoints for managing companies, contacts, deals, and user authentication.")
    .setVersion("1.0.0")
    .addBearerAuth()
    .addTag('Authentication', 'User authentication and authorization endpoints')
    .addTag('Companies', 'Company management endpoints')
    .addTag('Contacts', 'Contact management endpoints')
    .addTag('Deals', 'Deal management endpoints')
    .addTag('Users', 'User management endpoints')
    .addTag('Dashboard', 'Dashboard statistics endpoints')
    .build()

  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig)
  
  // Write swagger.json file
  fs.writeFileSync('./swagger.json', JSON.stringify(swaggerDocument, null, 2))
  
  SwaggerModule.setup("api/docs", app, swaggerDocument)

  // app.setGlobalPrefix("api")

  await app.listen(3001)
  console.log("CRM Backend API is running on http://localhost:3001")
  console.log("Swagger documentation available at http://localhost:3001/api/docs")
  console.log("Swagger JSON available at ./swagger.json")
}
bootstrap()
