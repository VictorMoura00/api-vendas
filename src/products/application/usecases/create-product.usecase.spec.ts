import { ProductsRepository } from '@/products/domain/repositories/products.repository'
import { CreateProductUseCase } from './create-product.usecase'
import { ProductsInMemoryRepository } from '@/products/infrastructure/in-memory/repositories/products-in-memory.repository'
import { ConflictError } from '@/common/domain/errors/conflict-error'
import { BadRequestError } from '@/common/domain/errors/bad-request-error'

describe('CreateProductUseCase Unit Test', () => {
  let sut: CreateProductUseCase.UseCase
  let repository: ProductsRepository

  beforeEach(() => {
    repository = new ProductsInMemoryRepository()
    sut = new CreateProductUseCase.UseCase(repository)
  })

  it('should be create a product', async () => {
    const spyInsert = jest.spyOn(repository, 'insert')
    const props = {
      name: 'Product 1',
      price: 100,
      quantity: 10,
    }
    const result = await sut.execute(props)

    expect(result).toBeDefined()
    expect(result.id).toBeDefined()
    expect(result.name).toBe(props.name)
    expect(result.price).toBe(props.price)
    expect(result.quantity).toBe(props.quantity)
    expect(result.created_at).toBeInstanceOf(Date)
    expect(result.updated_at).toBeInstanceOf(Date)
    expect(spyInsert).toHaveBeenCalledTimes(1)
  })

  it('should not be possible to register a product with the name of another product', async () => {
    const props = {
      name: 'Product 1',
      price: 100,
      quantity: 10,
    }
    await sut.execute(props)

    await expect(() => sut.execute(props)).rejects.toBeInstanceOf(ConflictError)
  })

  it('should throws error when name not provided', async () => {
    const props = {
      name: '',
      price: 100,
      quantity: 10,
    }
    await expect(() => sut.execute(props)).rejects.toBeInstanceOf(
      BadRequestError,
    )
  })

  it('Should throws error when price not provided', async () => {
    const props = {
      name: 'Product 1',
      price: 0,
      quantity: 10,
    }
    await expect(() => sut.execute(props)).rejects.toBeInstanceOf(
      BadRequestError,
    )
  })

  it('Should throws error when quantity not provided', async () => {
    const props = {
      name: 'Product 1',
      price: 100,
      quantity: 0,
    }
    await expect(() => sut.execute(props)).rejects.toBeInstanceOf(
      BadRequestError,
    )
  })
})
