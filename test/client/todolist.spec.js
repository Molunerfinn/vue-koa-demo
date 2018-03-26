import Vue from 'vue'
import elementUI from 'element-ui'
import { mount } from '@vue/test-utils'
import Todolist from '../../src/components/Todolist.vue'
import axios from 'axios'

Vue.use(elementUI)

jest.mock('axios', () => ({
  post: jest.fn()
        // for test 2
        .mockImplementationOnce(() => Promise.resolve({
          status: 200
        }))
        // for test 3
        .mockImplementationOnce(() => Promise.resolve({
          status: 200
        })),
  get: jest.fn()
        // for test 1
        .mockImplementationOnce(() => Promise.resolve({
          status: 200,
          data: {
            result: []
          }
        }))
        // for test 2
        .mockImplementationOnce(() => Promise.resolve({
          status: 200,
          data: {
            result: []
          }
        }))
        // for test 3
        .mockImplementationOnce(() => Promise.resolve({
          status: 200,
          data: {
            result: []
          }
        }))
        // for test 3
        .mockImplementationOnce(() => Promise.resolve({
          status: 200,
          data: {
            result: [
              {
                status: '0',
                content: 'Test',
                id: 1
              }
            ]
          }
        }))
        // for test 4
        .mockImplementationOnce(() => Promise.resolve({
          status: 200,
          data: {
            result: [
              {
                status: 1,
                content: 'Test1',
                id: 1
              }
            ]
          }
        }))
        // for test 5
        .mockImplementationOnce(() => Promise.resolve({
          status: 200,
          data: {
            result: [
              {
                status: '0',
                content: 'Test1',
                id: 1
              }
            ]
          }
        }))
        // for test 6
        .mockImplementationOnce(() => Promise.resolve({
          status: 200,
          data: {
            result: [
              {
                status: '0',
                content: 'Test1',
                id: 1
              }
            ]
          }
        }))
        // for test 7
        .mockImplementationOnce(() => Promise.resolve({ status: 200,
          data: {
            result: []
          }
        })),
  put: jest.fn()
        // for test 4
        .mockImplementationOnce(() => Promise.resolve({
          status: 200
        }))
        // for test 6
        .mockImplementationOnce(() => Promise.resolve({
          status: 200
        })),
  delete: jest.fn()
        // for test 5
        .mockImplementationOnce(() => Promise.resolve({
          status: 200
        }))
}))

Vue.prototype.$http = axios

let wrapper

beforeEach(() => {
  wrapper = mount(Todolist)
  wrapper.setData({
    name: 'Molunerfinn',
    id: 2
  })
})

// test 1
test('Should get the right username & id', () => {
  expect(wrapper.vm.name).toBe('Molunerfinn')
  expect(wrapper.vm.id).toBe(2)
})

// test 2
test('Should trigger addTodos when typing the enter key', () => {
  const stub = jest.fn()
  wrapper.setMethods({
    addTodos: stub
  })
  const input = wrapper.find('.el-input')
  input.trigger('keyup.enter')
  expect(stub).toBeCalled()
})

// test 3
test('Should add a todo if handle in the right way', async () => {
  wrapper.setData({
    todos: 'Test',
    stauts: '0',
    id: 1
  })

  await wrapper.vm.addTodos()
  await wrapper.update()
  expect(wrapper.vm.list).toEqual([
    {
      status: '0',
      content: 'Test',
      id: 1
    }
  ])
})

// test 4
test('Should restore a todo if click the restore button', async () => {
  wrapper.setData({
    activeName: 'second' // 切换到第二个选项卡
  })
  wrapper.setMethods({
    getTodolist: jest.fn(() => {
      wrapper.setData({
        list: [
          {
            status: '0',
            content: 'Test1',
            id: 1
          }
        ]
      })
    })
  })
  expect(wrapper.contains('.finished')).toBeTruthy()
  wrapper.find('.restore-item').trigger('click')
  wrapper.find('.el-tabs__item').trigger('click')
  await wrapper.update()
  expect(wrapper.contains('.no-finished')).toBeTruthy()
})

// test 5
test('Should remove a todo if click the remove button', async () => {
  wrapper.setMethods({
    getTodolist: jest.fn(() => {
      wrapper.setData({
        list: []
      })
    })
  })
  expect(wrapper.contains('.no-finished')).toBeTruthy()
  wrapper.find('.remove-item').trigger('click')
  await wrapper.update()
  expect(wrapper.contains('.no-finished')).not.toBeTruthy()
})

// test 6
test('Should finish a todo if click the finish button', async () => {
  wrapper.setMethods({
    getTodolist: jest.fn(() => {
      wrapper.setData({
        list: [
          {
            status: 1,
            content: 'Test1',
            id: 1
          }
        ]
      })
    })
  })
  expect(wrapper.contains('.no-finished')).toBeTruthy()
  wrapper.find('.finish-item').trigger('click')
  await wrapper.update()
  expect(wrapper.contains('.no-finished')).not.toBeTruthy()
})

// test 7
test('Should have the expected html structure', () => {
  expect(wrapper.element).toMatchSnapshot()
})
