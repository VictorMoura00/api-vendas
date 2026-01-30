/* eslint-disable prettier/prettier */
import { randomUUID } from 'node:crypto'
import { NotFoundError } from '../error/not-found-error'
import {
  RepositoryInterface,
  SearchOutput,
  SearchInput,
} from './repository.interface'

export type ModelProps = {
  id: string
  [key: string]: any
}

export type CreateProps = {
  [key: string]: any
}

export abstract class InMemoryRepository<Model extends ModelProps, CreateProps>
  implements RepositoryInterface<Model, CreateProps>
{
  items: Model[] = []
  sortableFields: string[] = []

  create(_props: CreateProps): Model {
    const model = {
      id: randomUUID(),
      created_at: new Date(),
      updated_at: new Date(),
      ..._props,
    }
    return model as unknown as Model
  }

  async insert(_model: Model): Promise<Model> {
    this.items.push(_model)
    return _model
  }

  findAll(): Promise<Model[]> {
    throw new Error('Method not implemented.')
  }

  async findById(_id: string): Promise<Model | null> {
    return this._get(_id)
  }

  async update(_model: Model): Promise<Model> {
    await this._get(_model.id)
    const index = this.items.findIndex(item => item.id === _model.id)
    this.items[index] = _model
    return _model
  }

  async delete(_id: string): Promise<void> {
    await this._get(_id)
    const index = this.items.findIndex(item => item.id === _id)
    this.items.splice(index, 1)
  }

  async search(_props: SearchInput): Promise<SearchOutput<Model>> {
    const page = _props.page ?? 1
    const per_page = _props.per_page ?? 15
    const sort = _props.sort ?? null
    const sort_dir = _props.sort_dir ?? null
    const filter = _props.filter ?? null

    const filteredItems = await this.applyFilter(this.items, filter)
    const sorted_items = await this.applySort(
      filteredItems,
      sort,
      sort_dir,
    )
    const paginatedItems = await this.applyPaginate(
      sorted_items,
      page,
      per_page,
    )

    return {
      items: paginatedItems,
      per_page: per_page,
      total: filteredItems.length,
      current_page: page,
      sort: sort,
      sort_dir: sort_dir,
      filter: filter,
      last_page: Math.ceil(filteredItems.length / per_page),
    }
  }

  protected abstract applyFilter(
    items: Model[],
    filter: string | null,
  ): Promise<Model[]>

  protected async applySort(
    items: Model[],
    sort: string | null,
    sort_dir: string | null,
  ): Promise<Model[]> {
    if (!sort || !this.sortableFields.includes(sort)) {
      return items
    }

    return [...items].sort((a, b) => {
      const a_value = a[sort]
      const b_value = b[sort]
      if (a_value < b_value) {
        return sort_dir === 'asc' ? -1 : 1
      }
      if (a_value > b_value) {
        return sort_dir === 'asc' ? 1 : -1
      }
      return 0
    })
  }

  protected async applyPaginate(
    items: Model[],
    page: number,
    per_page: number,
  ): Promise<Model[]> {
    const start = (page - 1) * per_page
    const end = start + per_page
    return items.slice(start, end)
  }

  protected async _get(id: string): Promise<Model> {
    const model = this.items.find(item => item.id === id)
    if (!model) {
      throw new NotFoundError(`Model with id ${id} not found`)
    }
    return model
  }
}
