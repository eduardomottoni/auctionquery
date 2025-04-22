// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })

// Command to handle authentication by clicking the "Generate Token and Login" button
Cypress.Commands.add('authenticate', () => {
  cy.log('Authenticating user by clicking Generate Token & Login button');
  cy.get('button:contains("Generate Token & Login")').click();
  // Wait for authentication process to complete and app to load
  cy.contains('Available Vehicles', { timeout: 10000 }).should('be.visible');
});

// Command to wait for vehicles to load
Cypress.Commands.add('waitForVehiclesLoad', () => {
  cy.log('Waiting for vehicles to load...');
  
  // First check if loading message exists and wait for it to disappear
  cy.get('body').then($body => {
    if ($body.text().includes('Loading vehicles...')) {
      cy.contains('Loading vehicles...').should('not.exist', { timeout: 20000 });
    }
  });

  // Then wait for content to appear - either vehicles or "no vehicles" message
  cy.get('body', { timeout: 15000 }).then($body => {
    const vehicleGridExists = $body.find('[data-testid="vehicle-grid"]').length > 0;
    const vehicleListExists = $body.find('[data-testid="vehicle-list"]').length > 0;
    const vehicleCardExists = $body.find('[data-testid="vehicle-card"]').length > 0;
    const vehicleListItemExists = $body.find('[data-testid="vehicle-list-item"]').length > 0;
    const noVehiclesMessageExists = $body.text().includes('No vehicles match the current criteria');
    
    // Check if we have either:
    // 1. One of the vehicle display elements, OR
    // 2. The "No vehicles match" message
    if (!(vehicleGridExists || vehicleListExists || vehicleCardExists || vehicleListItemExists || noVehiclesMessageExists)) {
      // If none of the above elements exist, wait a bit more and retry
      cy.wait(3000);
      cy.log('Waiting a bit longer for vehicle content to appear...');
    }
  });
  
  // Wait a bit more to ensure asynchronous rendering is complete
  cy.wait(1000);
});

// Custom command to check if element is visible in viewport
Cypress.Commands.add('isInViewport', { prevSubject: true }, (subject) => {
  const bottom = Cypress.$(cy.state('window')).height();
  const rect = subject[0].getBoundingClientRect();
  
  expect(rect.top).to.be.lessThan(bottom);
  expect(rect.bottom).to.be.greaterThan(0);
  return subject;
});

// Custom command to select a vehicle by make or model
Cypress.Commands.add('selectVehicleByMake', (make) => {
  cy.get('input[name="make"]').clear().type(make);
  cy.contains('button', 'Apply Filters').click();
  cy.wait(1000); // Wait for filtering to complete
});

// Command to wait until content has loaded (no loading indicator)
Cypress.Commands.add('waitForContent', () => {
  cy.get('body').then($body => {
    if ($body.find('Loading vehicles...').length) {
      cy.contains('Loading vehicles...').should('not.exist', { timeout: 10000 });
    }
  });
});

// Command to toggle between grid and list views
Cypress.Commands.add('toggleView', (view) => {
  if (view === 'grid') {
    cy.get('[data-testid="grid-icon"]').click();
  } else if (view === 'list') {
    cy.get('[data-testid="list-icon"]').click();
  }
});

// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

// Add TypeScript definitions if needed (commented out for JS projects)
/* 
declare namespace Cypress {
  interface Chainable {
    authenticate(): Chainable<Element>
    waitForVehiclesLoad(): Chainable<Element>
    selectVehicleByMake(make: string): Chainable<Element>
    waitForContent(): Chainable<Element>
    toggleView(view: 'grid' | 'list'): Chainable<Element>
    isInViewport(): Chainable<Element>
  }
}
*/ 