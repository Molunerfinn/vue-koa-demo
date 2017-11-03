import server from '../../app.js'
import request from 'supertest'

afterEach(() => {
  server.close()
})

test('Login fail if typing Molunerfinn & 1234', async () => {
  const response = await request(server)
                    .post('/auth/user')
                    .send({
                      name: 'Molunerfinn',
                      password: '1234'
                    })
  expect(response.body.success).toBe(false)
})

test('Login success if typing Molunerfinn & 123', async () => {
  const response = await request(server)
                    .post('/auth/user')
                    .send({
                      name: 'Molunerfinn',
                      password: '123'
                    })
  expect(response.body.success).toBe(true)
})

test('Login fail if typing MARK & 123', async () => {
  const response = await request(server)
                    .post('/auth/user')
                    .send({
                      name: 'MARK',
                      password: '123'
                    })
  expect(response.body.info).toBe('用户不存在！')
})
