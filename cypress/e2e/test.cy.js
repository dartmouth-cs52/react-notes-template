describe('notes app', () => {
  const firstNote = 'Testing Note 1';
  const newTitle = 'New Title';

  it('can add new note', () => {
    cy.visit('/');
    cy.get('.noteinput').find('input').type(`${firstNote}`);
    cy.get('.noteinput').submit();

    cy.get('.note')
      .should('exist');

    cy.get('.note')
      .last()
      .get('h1')
      .contains(firstNote);
  });

  it('.note should have position absolute', () => {
    cy.visit('/');
    cy.get('.note')
      .first()
      .invoke('css', 'position')
      .should('equal', 'absolute');
  });

  it('can edit note', () => {
    cy.visit('/');
    cy.get('.note')
      .last()
      .get('[aria-label=edit]')
      .last()
      .click({ force: true });

    cy.get('.note')
      .last()
      .get('input')
      .get('[value="Testing Note 1"]')
      .should('exist')
      .type(`{selectall}{backspace}${newTitle}{enter}`)
      .get('[aria-label=done-editing]')
      .click({ force: true });

    cy.get('.note')
      .last()
      .find('h1')
      .contains(newTitle);
  });
  it('can delete note', () => {
    cy.visit('/');
    cy.get('.note')
      .last()
      .get('[aria-label=delete]')
      .last()
      .click({ force: true });

    cy.get('.note')
      .last()
      .find('h1')
      .not(newTitle);
  });

  it('should be synchronized with firebase; should rerender on database update', () => {
    let url = '';
    const urlRegex = /(https?:\/\/[^ ]*.firebaseio.com)/;
    const testText = String(Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)); // generate random string for ID + check
    const testID = `test-${testText}`;
    const file = 'src/services/datastore.js';
    cy.readFile(file).then((str) => {
      const databaseURL = `${str.split('databaseURL:')[1].match(urlRegex)[1]}`;
      url = `${databaseURL}/notes/${testID}.json`;
      console.log(`url: ${url}`);
      const method = 'PUT';
      const body = {
        title: testText,
        text: 'TEST',
        id: testID,
        x: 0,
        y: 0,
      };
      cy.request(method, url, body);
    }).then(() => {
      cy.visit('/');
      cy.get('h1')
        .contains(testText)
        .should('exist');
    }).then(() => {
      cy.request('DELETE', url); // remove from db
    });
  });
});
