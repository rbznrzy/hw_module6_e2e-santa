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
import { faker } from "@faker-js/faker";
const loginPage = require("../fixtures/pages/loginPage.json");
const generalElements = require("../fixtures/pages/general.json");
const users = require("../fixtures/users.json");
const inviteeBoxPage = require("../fixtures/pages/inviteeBoxPage.json");
const inviteeDashboardPage = require("../fixtures/pages/inviteeDashboardPage.json");

let wishes = faker.word.noun() + faker.word.adverb() + faker.word.adjective();

/** Login on UI */
Cypress.Commands.add("login", (userName, password) => {
  cy.get(loginPage.loginField).type(userName);
  cy.get(loginPage.passwordField).type(password);
  cy.get(generalElements.submitButton).click({ force: true });
});

/** Add participants by invite link*/
Cypress.Commands.add("inviteLinkAddingParticipant", (i) => {
  cy.get(generalElements.submitButton).click();
    cy.contains("войдите").click();
    cy.login(users["user" + i].email, users["user" + i].password);
    cy.contains("Создать карточку участника").should("exist");
    cy.get(generalElements.submitButton).click();
    cy.get(generalElements.arrowRight).click();
    cy.get(generalElements.arrowRight).click();
    cy.get(inviteeBoxPage.wishesInput).type(wishes);
    cy.get(generalElements.arrowRight).click();
    cy.get(inviteeDashboardPage.noticeForInvitee)
      .invoke("text")
      .then((text) => {
        expect(text).to.contain("Это — анонимный чат с вашим Тайным Сантой");
      });
})

/** Deleting Box using API */
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
            Cookie: `${responseCookie}; ${requestCookie}`
          }
      });
    });
});

/** Parsing participant id */
Cypress.Commands.add("parseParticipantId", (boxId) => {
  cy.request({
      method: "GET",
      url: `/api/box/${boxId}/cards`,
  }).then((response) => {
    const responseIdArray = []
    response.forEach(participant => {
      responseIdArray.push(participant.id);
    });
  });
});

/** Deleting Participant using API */
Cypress.Commands.add("deletingParticipant", (boxId, responseIdArray) => {
  responseIdArray.forEach(participant => {
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
        url: `/api/box/${boxId}/card/${participant}`,
        headers: {
          Authorization: `${responseCookie}; ${requestCookie}`
        }
    });
  });
});
  })
