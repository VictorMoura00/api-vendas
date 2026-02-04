import express from 'express'
import cors from 'cors'
import { routes } from './routes'
import { errorHandler } from './middlewares/errorHandler'
import swaggerJSDoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API :)',
      version: '1.0.0',
      description: 'Documentação da API de Vendas',
    },
    servers: [
      {
        url: 'http://localhost:3333',
      },
    ],
  },
  apis: ['./src/**/http/routes/*.ts'],
}

const swaggerSpec = swaggerJSDoc(options)

const app = express()

app.use(cors())
app.use(express.json())
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
app.use(routes)
app.use(errorHandler)

export { app }
