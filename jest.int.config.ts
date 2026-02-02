import { pathsToModuleNameMapper } from 'ts-jest'
import * as fs from 'fs'
import * as path from 'path'

const tsconfigPath = path.join(process.cwd(), 'tsconfig.json')
const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf-8'))
const compilerOptions = tsconfig.compilerOptions

export default {
  moduleFileExtensions: ['ts', 'js', 'json'],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: '<rootDir>/',
  }),
  testRegex: '.*\\.int-spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  // ADIÇÃO IMPORTANTE:
  // Diz ao Jest para transformar arquivos JS, mas NÃO ignorar o faker.
  // A regex significa: "Ignore node_modules, a menos que seja @faker-js/faker"
  transformIgnorePatterns: ['node_modules/(?!@faker-js/faker)'],
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
}
