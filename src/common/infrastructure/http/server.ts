import { env } from '../env'
import { dataSource } from '../typeorm'
import { app } from './app'

dataSource
  .initialize()
  .then(() => {
    console.log('\n')
    console.log('✅ Conectado ao banco de dados.')
    app.listen(env.PORT, () => {
      console.log(`🚀 Servidor sendo executado em ${env.API_URL}`)
      console.log(`📄 Documentação da API em ${env.API_URL}/docs`)
    })
  })
  .catch(error => {
    console.error('❌ Erro ao conectar no banco de dados:', error)
  })
