import { AppError } from '@/common/domain/errors/app-error'
import { Request, Response } from 'express'
import { z } from 'zod'
import { ProductsTypeormRepository } from '../../typeorm/repositories/products-typeorm.repository'
import { dataSource } from '@/common/infrastructure/typeorm'
import { Product } from '../../typeorm/entities/products.entity'
import { CreateProductUseCase } from '@/products/application/usecases/create-product.usecase'

export async function createProductController(
  request: Request,
  response: Response,
) {
  const createProductBodySchema = z.object({
    name: z.string(),
    price: z.number(),
    quantity: z.number(),
  })

  const validatedData = createProductBodySchema.safeParse(request.body)

  if (!validatedData.success) {
    // 1. Correção Zod: Use .issues em vez de .errors
    const errorMessage = validatedData.error.issues
      .map(issue => `${issue.path.join('.')} -> ${issue.message}`)
      .join(', ')

    console.error('Invalid data', validatedData.error.format())
    throw new AppError(errorMessage)
  }

  const { name, price, quantity } = validatedData.data

  // 2. Correção Repositório: Passe o repositório diretamente no construtor
  // Isso resolve o erro de "argumento esperado" e o erro de "propriedade privada"
  const productRepositoryTypeorm = dataSource.getRepository(Product)
  const repository = new ProductsTypeormRepository(productRepositoryTypeorm)

  const createProductUseCase = new CreateProductUseCase.UseCase(repository)

  const product = await createProductUseCase.execute({ name, price, quantity })

  return response.status(201).json(product)
}
