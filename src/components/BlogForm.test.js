import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import BlogForm from './BlogForm'

describe('<BlogForm />', () => {
  test('<BlogForm /> updates parent state and calls onSubmit', () => {
    const createBlog = jest.fn()

    const component = render(
      <BlogForm createBlog={createBlog} />
    )

    const title = component.container.querySelector('#title')
    const author = component.container.querySelector('#author')
    const url = component.container.querySelector('#url')
    const form = component.container.querySelector('form')

    fireEvent.change(title, {
      target: { value: 'Test title' }
    })

    fireEvent.change(author, {
      target: { value: 'Test author' }
    })

    fireEvent.change(url, {
      target: { value: 'Test url' }
    })

    fireEvent.submit(form)

    expect(createBlog.mock.calls[0][0].title).toBe('Test title')
    expect(createBlog.mock.calls[0][0].author).toBe('Test author')
    expect(createBlog.mock.calls[0][0].url).toBe('Test url')
  })
})
