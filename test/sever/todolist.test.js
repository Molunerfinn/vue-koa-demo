import server from '../../app.js'
import request from 'supertest'

afterEach(() => {
  server.close()
})

let todoId = null

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoibW9sdW5lcmZpbm4iLCJpZCI6MiwiaWF0IjoxNTA5ODAwNTg2fQ.JHHqSDNUgg9YAFGWtD0m3mYc9-XR3Gpw9gkZQXPSavM'

test('Getting todolist should return 401 if not set the JWT', async () => {
  const response = await request(server)
                    .get('/api/todolist/2')
  expect(response.status).toBe(401)
})

test('Get todolist -> [] if the user is not exist', async () => {
  const response = await request(server)
                    .get('/api/todolist/3')
                    .set('Authorization', 'Bearer ' + token)
  expect(response.body.result).toEqual([])
})

test('Post todolist successfully if set the JWT & correct user', async () => {
  const response = await request(server)
                    .post('/api/todolist')
                    .send({
                      status: false,
                      content: '来自测试',
                      id: 2
                    })
                    .set('Authorization', 'Bearer ' + token)
  expect(response.body.success).toBe(true)
})

test('Get todolist successfully if set the JWT & correct user', async () => {
  const response = await request(server)
                    .get('/api/todolist/2')
                    .set('Authorization', 'Bearer ' + token)
  response.body.result.forEach((item, index) => {
    if (item.content === '来自测试') todoId = item.id
  })
  expect(response.body.success).toBe(true)
})

test('Failed to update todolist if not update the status of todolist', async () => {
  const response = await request(server)
                    .put(`/api/todolist/2/${todoId}/1`)
                    .set('Authorization', 'Bearer ' + token)
  expect(response.body.success).toBe(false)
})

test('Update todolist successfully if set the JWT & correct todoId', async () => {
  const response = await request(server)
                    .put(`/api/todolist/2/${todoId}/0`)
                    .set('Authorization', 'Bearer ' + token)
  expect(response.body.success).toBe(true)
})

test('Remove todolist successfully if set the JWT & correct todoId', async () => {
  const response = await request(server)
                    .delete(`/api/todolist/2/${todoId}`)
                    .set('Authorization', 'Bearer ' + token)
  expect(response.body.success).toBe(true)
})

test('Failed to post todolist if not give the params', async () => {
  const response = await request(server)
            .post('/api/todolist')
            .set('Authorization', 'Bearer ' + token)
  expect(response.status).toBe(500)
})
