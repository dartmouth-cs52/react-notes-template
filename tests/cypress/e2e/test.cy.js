describe('notes app', () => {
  const firstNoteTitle = 'Testing Note 1';
  const firstNoteText = 'This is my first test note';
  const newTitle = 'New Title';

  it('can add new note', () => {
    cy.visit('/');

    // Debug: log the page body content
    cy.get('body').then(($body) => {
      console.log('Page HTML:', $body.html());
    });

    // Click the plus button to open modal
    cy.get('#plus', { timeout: 10000 }).should('be.visible').click();

    // Fill in the modal form
    cy.get('.title', { timeout: 5000 }).should('be.visible').type(firstNoteTitle);
    cy.get('.note').type(firstNoteText);

    // Submit the form
    cy.get('.submit-button').click();

    // Verify note appears
    cy.get('.note-div', { timeout: 5000 })
      .should('exist')
      .and('contain', firstNoteTitle);
  });

  it('.note-div should have position absolute', () => {
    cy.visit('/');

    // First create a note so we have something to test
    cy.get('#plus', { timeout: 10000 }).should('be.visible').click();
    cy.get('.title', { timeout: 5000 }).should('be.visible').type('Position Test');
    cy.get('.note').type('Testing position');
    cy.get('.submit-button').click();

    // Now verify the note has position absolute
    cy.get('.note-div', { timeout: 5000 })
      .first()
      .invoke('css', 'position')
      .should('equal', 'absolute');
  });

  it('can edit note', () => {
    cy.visit('/');

    // First create a note to edit
    cy.get('#plus', { timeout: 10000 }).should('be.visible').click();
    cy.get('.title', { timeout: 5000 }).should('be.visible').type('Original Title');
    cy.get('.note').type('Original text');
    cy.get('.submit-button').click();

    // Wait for note to appear
    cy.get('.note-div', { timeout: 5000 }).should('exist');

    // Click edit button on the last note
    cy.get('.note-div')
      .last()
      .find('[label="edit"]')
      .click({ force: true });

    // Update the title in the modal
    cy.get('.title', { timeout: 5000 })
      .should('be.visible')
      .clear()
      .type(newTitle);

    // Submit changes
    cy.get('.submit-button').click();

    // Verify the title was updated
    cy.get('.note-div', { timeout: 5000 })
      .last()
      .should('contain', newTitle);
  });

  it('can delete note', () => {
    cy.visit('/');

    // First create a note to delete
    cy.get('#plus', { timeout: 10000 }).should('be.visible').click();
    cy.get('.title', { timeout: 5000 }).should('be.visible').type('Delete Me');
    cy.get('.note').type('This will be deleted');
    cy.get('.submit-button').click();

    // Wait for note to appear and get count
    cy.get('.note-div', { timeout: 5000 }).should('exist').then(($notes) => {
      const initialCount = $notes.length;

      // Click delete button on the last note
      cy.get('.note-div')
        .last()
        .find('[label="delete"]')
        .click({ force: true });

      // Verify one less note exists or no notes at all
      cy.wait(500);
      cy.get('body').then(($body) => {
        const remainingNotes = $body.find('.note-div').length;
        expect(remainingNotes).to.equal(initialCount - 1);
      });
    });
  });
});
