import Vue from 'vue'
import elementUI from 'element-ui'
import { mount } from '@vue/test-utils'
import Login from '../../src/components/Login.vue'
import axios from 'axios'

Vue.use(elementUI)

jest.mock('axios', () => ({
  post: jest.fn()
        .mockImplementationOnce(() => Promise.resolve({
          data: {
            success: false,
            info: '用户不存在！'
          }
        }))
        .mockImplementationOnce(() => Promise.resolve({
          data: {
            success: false,
            info: '密码错误！'
          }
        }))
        .mockImplementationOnce(() => Promise.resolve({
          data: {
            success: true,
            token: 'xxx'
          }
        }))
}))

Vue.prototype.$http = axios

let wrapper

const $router = {
  push: jest.fn()
}

beforeEach(() => {
  wrapper = mount(Login, {
    mocks: {
      $router
    }
  })
})

test('Should have two input & one button', () => {
  const inputs = wrapper.findAll('.el-input')
  const loginButton = wrapper.contains('.el-button')
  expect(inputs.length).toBe(2)
  expect(loginButton).toBeTruthy()
})

test('Should have the expected html structure', () => {
  expect(wrapper.element).toMatchSnapshot()
})

test('loginToDo should be called after clicking the button', () => {
  const stub = jest.fn()
  wrapper.setMethods({ loginToDo: stub })
  wrapper.find('.el-button').trigger('click')
  expect(stub).toBeCalled()
})

test('Failed to login if not typing the username & password', async () => {
  const result = await wrapper.vm.loginToDo()
  expect(result.data.success).toBe(false)
  expect(result.data.info).toBe('用户不存在！')
})

test('Failed to login if not typing the correct password', async () => {
  wrapper.setData({
    account: 'molunerfinn',
    password: '1234'
  })
  const result = await wrapper.vm.loginToDo()
  expect(result.data.success).toBe(false)
  expect(result.data.info).toBe('密码错误！')
})

test('Succeeded to login if typing the correct account & password', async () => {
  wrapper.setData({
    account: 'molunerfinn',
    password: '123'
  })
  const result = await wrapper.vm.loginToDo()
  expect(result.data.success).toBe(true)
})
