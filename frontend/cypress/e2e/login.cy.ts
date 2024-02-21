
describe('Log in End 2 End', () => {

  it('Logging in with invalid credentials', () => {
    cy.visit('http://localhost:5173/login');

    cy.url().should('include', '/login');

    cy.contains('Username');
    cy.contains('Password');

    cy.get('input#email').type('hello@gmail.com');
    cy.get('input#password').type('12345678');

    cy.get('button').contains('Log in').click();
  });

  it('Logging in with valid credentials', () => {

    cy.visit('http://localhost:5173/login');

    cy.url().should('include', '/login');

    cy.contains('Username');
    cy.contains('Password');

    cy.get('input#email').type('wiedatabase761@gmail.com');
    cy.get('input#password').type('password');
    
    cy.get('button').contains('Log in').click();

    cy.url().should('eq', 'http://localhost:5173/');
  });
})