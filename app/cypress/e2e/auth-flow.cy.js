describe('Authentication Flow', () => {
  it('should authenticate successfully with Generate Token & Login button', () => {
    // Visit the homepage
    cy.visit('/');
    
    // Verify we're on the login page or some pre-login state
    cy.get('button:contains("Generate Token & Login")').should('be.visible');
    
    // Click the button to authenticate
    cy.get('button:contains("Generate Token & Login")').click();
    
    // Wait for authentication to complete and redirect to happen
    // The timeout is increased because auth flows can sometimes take longer
    cy.contains('Available Vehicles', { timeout: 15000 }).should('be.visible');
    
    // Verify other elements that indicate successful login
    cy.get('header').should('be.visible');
    cy.get('form').should('be.visible'); // Filter form should be present
    
    // If there's a user profile or username displayed after login, check for that
    // This depends on your app's UI after login
    // cy.get('[data-testid="user-profile"]').should('be.visible');
  });

  it('should maintain authentication between page visits', () => {
    // Visit the homepage and authenticate
    cy.visit('/');
    cy.authenticate();
    
    // Navigate to another page (if available)
    cy.get('header').contains('Home').click();
    
    // Verify we're still authenticated (no login button)
    cy.get('button:contains("Generate Token & Login")').should('not.exist');
    
    // Verify we can still see content that requires authentication
    cy.contains('Available Vehicles').should('be.visible');
  });
}); 