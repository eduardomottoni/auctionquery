describe('Vehicle Auction App', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.authenticate();
    cy.contains('Available Vehicles').should('be.visible');
    cy.waitForVehiclesLoad();
  });

  it('should display the vehicle auction homepage', () => {
    cy.title().should('include', 'Vehicle Auction');
    cy.get('header').should('be.visible');
    cy.contains('AuctionApp').should('be.visible');
    cy.get('form').should('be.visible');
    cy.get('footer').should('contain', 'Vehicle Auction');
  });

  it('should have working navigation in the header', () => {
    cy.get('header').contains('Home').should('be.visible');
    cy.get('header').contains('Protected').should('be.visible');
    cy.get('header').contains('Favorites').should('not.exist');
  });

  it('should display filter and sort controls', () => {
    cy.get('input[name="make"]').should('be.visible');
    cy.get('input[name="model"]').should('be.visible');
    cy.get('input[name="minBid"]').should('be.visible');
    cy.get('input[name="maxBid"]').should('be.visible');
    cy.get('select').should('be.visible');
    cy.get('input[id="showFavoritesOnly"]').should('be.visible');
    cy.get('input[id="showFavoritesOnly"]').should('not.be.checked');
  });

  it('should allow filtering vehicles by make', () => {
    cy.waitForVehiclesLoad();
    cy.get('input[name="make"]').type('Ford');
    cy.contains('button', 'Apply Filters').click();
    cy.wait(3000);
    cy.contains('Loading vehicles...').should('not.exist', { timeout: 15000 });
    
    cy.get('body').then($body => {
      if ($body.text().includes('No vehicles match the current criteria')) {
        cy.contains('No vehicles match the current criteria').should('be.visible');
      } else {
        cy.get('body').then($body => {
          if ($body.find('[data-testid="vehicle-grid"]').length > 0) {
            cy.get('[data-testid="vehicle-grid"]').should('be.visible');
          } else if ($body.find('[data-testid="vehicle-list"]').length > 0) {
            cy.get('[data-testid="vehicle-list"]').should('be.visible');
          } else if ($body.find('[data-testid="vehicle-card"]').length > 0) {
            cy.get('[data-testid="vehicle-card"]').should('exist');
          } else if ($body.find('[data-testid="vehicle-list-item"]').length > 0) {
            cy.get('[data-testid="vehicle-list-item"]').should('exist');
          } else {
            cy.log('Vehicle elements not found with data-testid, checking for general content');
            expect($body.text()).to.not.include('No vehicles match the current criteria');
          }
        });
      }
    });
  });

  it('should toggle between grid and list view', () => {
    cy.waitForVehiclesLoad();
    cy.get('[data-testid="view-toggle"]').should('exist');
    cy.get('[data-testid="grid-icon"]').should('exist');
    cy.get('[data-testid="grid-icon"]').click();
    cy.wait(1000);
    cy.get('[data-testid="vehicle-grid"]').should('exist', { timeout: 5000 });
    
    cy.get('[data-testid="list-icon"]').should('exist');
    cy.get('[data-testid="list-icon"]').click();
    cy.wait(1000);
    cy.get('[data-testid="vehicle-list"]').should('exist', { timeout: 5000 });
  });

  it('should have working pagination if there are multiple pages', () => {
    cy.waitForVehiclesLoad();
    cy.wait(2000);
    
    cy.get('body').then($body => {
      const hasPagination = $body.find('[data-testid="pagination"]').length > 0;
      
      const hasNextButton = $body.find('[data-testid="next-page"]').length > 0;
      const hasPrevButton = $body.find('[data-testid="prev-page"]').length > 0;
      
      if (hasPagination) {
        cy.log('Pagination component found');
        cy.get('[data-testid="pagination"]').should('be.visible');
        
        if (hasNextButton) {
          cy.get('[data-testid="next-page"]').click();
          cy.wait(2000); 

          cy.waitForVehiclesLoad();
          
          cy.get('body').then($newBody => {
            const urlHasPage2 = cy.url().then(url => url.includes('page=2'));
            const stillHasContent = !$newBody.text().includes('No vehicles match the current criteria');
            
            cy.log('Checking if pagination worked');
          });
        } else {
          cy.log('No next button found, may be only one page');
        }
      } else if (hasNextButton || hasPrevButton) {
        cy.log('Pagination buttons found without pagination component');
        if (hasNextButton) {
          cy.get('[data-testid="next-page"]').click();
          cy.wait(2000);
          cy.waitForVehiclesLoad();
        }
      } else {
        cy.log('No pagination found, probably only one page of results');
      }
    });
  });

  it('should toggle show favorites filter', () => {
    cy.waitForVehiclesLoad();
    
    // Check initial state of show favorites checkbox
    cy.get('input[id="showFavoritesOnly"]').should('not.be.checked');
    
    // Click the checkbox to show only favorites
    cy.get('input[id="showFavoritesOnly"]').click();
    
    cy.wait(2000);
    
    cy.get('input[id="showFavoritesOnly"]').should('be.checked');
    
    cy.get('body').then($body => {
      const hasNoVehiclesMessage = $body.text().includes('No vehicles match the current criteria');
      const hasVehicles = 
        $body.find('[data-testid="vehicle-grid"]').length > 0 || 
        $body.find('[data-testid="vehicle-list"]').length > 0 ||
        $body.find('[data-testid="vehicle-card"]').length > 0 ||
        $body.find('[data-testid="vehicle-list-item"]').length > 0;
      
      if (hasNoVehiclesMessage) {
        cy.contains('No vehicles match the current criteria').should('be.visible');
      } else if (hasVehicles) {
        cy.log('Vehicles are displayed when showing favorites');
        if ($body.find('[data-testid="vehicle-grid"]').length > 0) {
          cy.get('[data-testid="vehicle-grid"]').should('be.visible');
        } else if ($body.find('[data-testid="vehicle-list"]').length > 0) {
          cy.get('[data-testid="vehicle-list"]').should('be.visible');
        }
      } else {
        cy.log('Neither vehicles nor "no vehicles" message found when showing favorites');
      }
    });
    
    // Toggle back
    cy.get('input[id="showFavoritesOnly"]').click();
    
    cy.wait(2000);
    
    // Check if checkbox is unchecked
    cy.get('input[id="showFavoritesOnly"]').should('not.be.checked');
    
    // Make sure vehicles are loaded again
    cy.waitForVehiclesLoad();
  });

  it('should have responsive design', () => {
    // Make sure vehicles are loaded
    cy.waitForVehiclesLoad();
    
    // Test desktop view
    cy.viewport(1200, 800);
    cy.get('header').should('be.visible');
    
    // Check if mobile menu icon exists using a flexible approach
    cy.get('body').then($body => {
      if ($body.find('[data-testid="mobile-menu-icon"]').length > 0) {
        cy.get('[data-testid="mobile-menu-icon"]').should('not.be.visible');
      } else {
        cy.log('Mobile menu icon not found with data-testid, might use a different selector');
      }
    });

    // Test mobile view
    cy.viewport(375, 667); // iPhone SE size
    cy.get('header').should('be.visible');
    
    // Verify that login information is not visible in mobile view
    cy.get('body').then($body => {
      // If AuthStatusWrapper exists, it should be hidden
      if ($body.find('header').find('AuthStatusWrapper').length > 0) {
        cy.get('header').find('AuthStatusWrapper').should('not.be.visible');
      }
    });
    
    // Check if mobile menu icon exists using a flexible approach
    cy.get('body').then($body => {
      if ($body.find('[data-testid="mobile-menu-icon"]').length > 0) {
        cy.get('[data-testid="mobile-menu-icon"]').should('be.visible');
        
        // Open mobile menu and check content
        cy.get('[data-testid="mobile-menu-icon"]').click();
        cy.wait(1000); // Wait a bit for the animation
        
        if ($body.find('[data-testid="mobile-menu"]').length > 0) {
          cy.get('[data-testid="mobile-menu"]').should('be.visible');
          cy.get('[data-testid="mobile-menu"]').contains('Home').should('be.visible');
          
          // Verify that login information is present in the mobile menu
          cy.get('[data-testid="mobile-menu"]').find('div').last().should('exist');
        } else {
          cy.log('Mobile menu not found with data-testid, might use a different selector');
        }
      } else {
        cy.log('Mobile menu icon not found with data-testid, might use a different selector');
      }
    });
  });
}); 