import React from 'react';
import NoteInput from '../../../src/components/note-input';

describe('<NoteInput>', () => {
  it('mounts', () => {
    cy.mount(<NoteInput />); // this command now works in any test!
  });
  it('type into input and submit', () => {
    cy.mount(<NoteInput onCreateNote={cy.spy().as('onClick')} />); // this command now works in any test!
    cy.get('input').type('test');
    cy.get('button').as('submitButton').click();
    cy.get('@onClick').should('have.been.called');
    cy.get('input').should('have.value', '');
  });
});
