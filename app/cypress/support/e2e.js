// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands';

// Note: We're no longer bypassing Auth0 authentication completely, as the app requires
// clicking the "Generate Token and Login" button. Instead, we'll handle this in our tests
// using the custom authenticate() command we created.

// We'll still set up some mocks for the Auth0 context that might be needed after login
Cypress.on('window:before:load', (win) => {
  // Create a mock for Auth0 context that will be used after the login process
  win.Auth0Mock = {
    isAuthenticated: true,
    user: {
      name: 'Test User',
      email: 'test@example.com',
      picture: 'https://via.placeholder.com/50'
    },
    getAccessTokenSilently: cy.stub().resolves('fake-token-123'),
    loginWithRedirect: cy.stub(),
    logout: cy.stub()
  };

  // This mock might or might not be used, depending on how the app is implemented
  // but we're providing it just in case it's needed after the initial authentication
  Object.defineProperty(win, 'Auth0Context', {
    value: win.Auth0Mock,
    configurable: true
  });
});

// Alternatively, if your app has a test backdoor route for authentication:
// Cypress.Commands.add('login', () => {
//   cy.request({
//     method: 'POST',
//     url: '/api/test/login',
//     body: { username: 'testuser', password: 'testpassword' }
//   });
// });

// Suppress uncaught exception warnings when testing
Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from failing the test
  console.log('Uncaught exception:', err.message);
  return false;
}); 