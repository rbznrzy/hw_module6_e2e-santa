// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
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

const loginPage = require("../fixtures/pages/loginPage.json");
const generalElements = require("../fixtures/pages/general.json");

Cypress.Commands.add("login", (userName, password) => {
  cy.get(loginPage.loginField).type(userName);
  cy.get(loginPage.passwordField).type(password);
  cy.get(generalElements.submitButton).click({ force: true });
});

Cypress.Commands.add("deletingBox", (boxId) => {
    cy.request({
        method: "POST",
        url: "api/login?redirect=%2F",
        body: {
            email: "rbznrzy.testing@gmail.com",
            password: "QC1069",
        },
    }).then((response) => {
      const requestCookie = response.headers['Cookie']
        const responseCookie = response.headers['set-cookie'];
        cy.request({
          method: "DELETE",
          url: `/api/box/${boxId}`,
          headers: {
            Authorization: `${responseCookie}; ${requestCookie}`
          }
      });
    });
});