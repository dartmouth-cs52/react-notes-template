const openNoteModal = () => {
  cy.get('#plus', { timeout: 10000 })
    .should('be.visible')
    .and('have.attr', 'aria-label', 'add note')
    .click();
};

const createNote = (title, body) => {
  openNoteModal();
  cy.get('.title', { timeout: 5000 }).should('be.visible').clear().type(title);
  cy.get('.note').clear().type(body);
  cy.get('.submit-button').click();
};

describe('notes app', () => {
  const firstNoteTitle = 'Testing Note 1';
  const firstNoteText = 'This is my first test note';
  const newTitle = 'New Title';

  beforeEach(() => {
    cy.visit('/');
  });

  it('can add new note', () => {
    createNote(firstNoteTitle, firstNoteText);

    cy.get('.note-div', { timeout: 5000 })
      .should('exist')
      .and('contain', firstNoteTitle);
  });

  it('can edit note', () => {
    createNote('Original Title', 'Original text');

    cy.get('.note-div', { timeout: 5000 }).should('exist');

    cy.get('.note-div')
      .last()
      .find('[aria-label="edit note"]')
      .should('have.attr', 'role', 'button')
      .click({ force: true });

    cy.get('.title', { timeout: 5000 })
      .should('be.visible')
      .clear()
      .type(newTitle);

    cy.get('.note').clear().type('Updated body copy');

    cy.get('.submit-button').click();

    cy.get('.note-div', { timeout: 5000 })
      .last()
      .should('contain', newTitle)
      .and('contain', 'Updated body copy');
  });

  it('prefills the modal with existing content when editing', () => {
    const originalBody = 'Prefill this body please';
    createNote('Prefill Title', originalBody);

    cy.get('.note-div').last().find('[aria-label="edit note"]').click({ force: true });

    cy.get('.title').should('have.value', 'Prefill Title');
    cy.get('.note').should('have.value', originalBody);
  });

  it('can delete note', () => {
    createNote('Delete Me', 'This will be deleted');

    cy.get('.note-div', { timeout: 5000 }).should('exist').then(($notes) => {
      const initialCount = $notes.length;

      cy.get('.note-div')
        .last()
        .find('[aria-label="delete note"]')
        .should('have.attr', 'role', 'button')
        .click({ force: true });

      cy.wait(500);
      cy.get('body').then(($body) => {
        const remainingNotes = $body.find('.note-div').length;
        expect(remainingNotes).to.equal(initialCount - 1);
      });
    });
  });
});
