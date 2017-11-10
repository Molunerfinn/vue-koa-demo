import server from '../../app.js'
import request from 'supertest'

afterEach(() => {
  server.close()
})

test('Failed to login if typing Molunerfinn & 1234', async () => {
  const response = await request(server)
                    .post('/auth/user')
                    .send({
                      name: 'Molunerfinn',
                      password: '1234'
                    })
  expect(response.body.success).toBe(false)
})

test('Successed to login if typing Molunerfinn & 123', async () => {
  const response = await request(server)
                    .post('/auth/user')
                    .send({
                      name: 'Molunerfinn',
                      password: '123'
                    })
  expect(response.body.success).toBe(true)
})

test('Failed to login if typing MARK & 123', async () => {
  const response = await request(server)
                    .post('/auth/user')
                    .send({
                      name: 'MARK',
                      password: '123'
                    })
  expect(response.body.info).toBe('用户不存在！')
})

test('Getting the user info is null if the url is /auth/user/10', async () => {
  const response = await request(server)
                    .get('/auth/user/10')
  expect(response.body).toEqual({})
})

test('Getting user info successfully if the url is /auth/user/2', async () => {
  const response = await request(server)
                    .get('/auth/user/2')
  expect(response.body.user_name).toBe('molunerfinn')
})
