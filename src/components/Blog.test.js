import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import Blog from './Blog'

let component = null
const likeMock = jest.fn()
const deleteBlogMock = jest.fn()

beforeEach(() => {
  const blog = {
    title: 'Test title',
    author: 'Test author',
    url: 'Test url',
    likes: 12,
    user: {
      username: 'maxteria',
      name: 'Maxteria',
      id: '5f9f5b9b9c9c1c0e8c8c1b5a'
    }
  }

  component = render(
    <Blog blog={blog} like={likeMock} deleteBlog={deleteBlogMock} user={null} />
  )
})

describe('Render content of <Blog /> ', () => {
  test('render title', () => {
    expect(component.container).toHaveTextContent('Test title')
  })

  test('render author', () => {
    expect(component.container).toHaveTextContent('Test author')
  })

  test('not render url and likes', () => {
    expect(component.container).not.toHaveTextContent('Test url')
    expect(component.container).not.toHaveTextContent('12 likes')
  })

  test('When click view button, renders content url and likes', () => {
    const buttonView = component.getByText('view')
    fireEvent.click(buttonView)

    expect(component.container).toHaveTextContent('Test url')
    expect(component.container).toHaveTextContent('12 likes')
  })
})

describe('Interactions with <Blog /> ', () => {
  test('When click like button twice, call the like function twice', () => {
    const viewButton = component.getByText('view')
    fireEvent.click(viewButton)

    const likeButton = component.getByText('like')
    fireEvent.click(likeButton)
    fireEvent.click(likeButton)
    expect(likeMock.mock.calls).toHaveLength(2)
  })

  test('When click like button, likes increment by one', () => {
    const viewButton = component.getByText('view')
    fireEvent.click(viewButton)

    const likeButton = component.getByText('like')
    fireEvent.click(likeButton)
    expect(likeMock.mock.calls[0][0].likes).toBe(13)
  })
})
