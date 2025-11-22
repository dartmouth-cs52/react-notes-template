/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { mount } from 'cypress/react';
import NoteInput from '../../src/components/note-input';

describe('<NoteInput>', () => {
  it('mounts', () => {
    mount(<NoteInput />);
  });
  it('type into input and submit', () => {
    mount(<NoteInput onCreateNote={cy.spy().as('onClick')} />);
    cy.get('input').type('test');
    cy.get('button').as('submitButton').click();
    cy.get('@onClick').should('have.been.called');
    cy.get('input').should('have.value', '');
  });
});
