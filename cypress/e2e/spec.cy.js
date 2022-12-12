describe('Blog App', () => {
  beforeEach(() => {
    cy.request('POST', 'http://localhost:3001/api/testing/reset')
    const user = {
      name: 'Test User',
      username: 'test',
      password: 'test'
    }

    cy.request('POST', 'http://localhost:3001/api/users/', user)
    cy.visit('http://localhost:3000')
  })

  it('Login form is shown', function () {
    cy.contains('login').click()
    cy.get('#login-username')
    cy.get('#login-password')
  })

  describe('Login', function () {
    it('succeeds with correct credentials', function () {
      cy.contains('login').click()
      cy.get('#login-username').type('test')
      cy.get('#login-password').type('test')
      cy.get('#login-submit').click()

      cy.contains('Test User logged in')
    })

    it('fails with wrong credentials', function () {
      cy.contains('login').click()
      cy.get('#login-username').type('test')
      cy.get('#login-password').type('wrong')
      cy.get('#login-submit').click()

      cy.get('.error')
        .should('contain', 'wrong credentials')
    })
  })

  describe('When logged in', function () {
    beforeEach(function () {
      cy.login({ username: 'test', password: 'test' })
    })

    it('A blog can be created', function () {
      cy.contains('new blog').click()
      cy.get('#newblog-title').type('Test Blog')
      cy.get('#newblog-author').type('Test Author')
      cy.get('#newblog-url').type('https://test.com')
      cy.get('#newblog-submit').click()

      cy.contains('Test Blog by Test Author')
    })

    it('A blog can be liked', function () {
      cy.createBlog({ title: 'Test title', author: 'Test Author', url: 'https://test.com', likes: 0 })
      cy.contains('view').click()
      cy.contains('like').click()
      cy.contains('1 likes')
    })

    it('A blog can be deleted', function () {
      cy.createBlog({ title: 'Test title', author: 'Test Author', url: 'https://test', likes: 0 })
      cy.contains('view').click()
      cy.contains('remove').click()

      cy.get('html').should('not.contain', 'Test title')
      cy.contains('Test title').should('not.exist')
    })

    it('Blogs are ordered by likes', function () {
      cy.createBlog({ title: 'Test title 1', author: 'Test Author', url: 'https://test1', likes: 0 })
      cy.createBlog({ title: 'Test title 2', author: 'Test Author', url: 'https://test2', likes: 1 })
      cy.createBlog({ title: 'Test title 3', author: 'Test Author', url: 'https://test3', likes: 2 })

      cy.get('.blog').then(blogs => {
        cy.wrap(blogs[0]).contains('view').click()
        cy.wrap(blogs[1]).contains('view').click()
        cy.wrap(blogs[2]).contains('view').click()
      })

      cy.get('.blog').then(blogs => {
        cy.wrap(blogs[2]).contains('like').click()
        cy.wrap(blogs[2]).contains('like').click()
        cy.wrap(blogs[2]).contains('like').click()
        cy.wrap(blogs[2]).contains('like').click()
        cy.wrap(blogs[2]).contains('like').click()
        cy.wrap(blogs[2]).contains('like').click()
        cy.wrap(blogs[2]).contains('like').click()
        cy.wrap(blogs[2]).contains('like').click()
        cy.wrap(blogs[2]).contains('like').click()
      })

      cy.get('.blog').then(blogs => {
        cy.wrap(blogs[0]).contains('Test title 1')
        cy.wrap(blogs[1]).contains('Test title 3')
        cy.wrap(blogs[2]).contains('Test title 2')
      })
    })
  })
})
