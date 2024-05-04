const users = require("../fixtures/users.json");
const boxPage = require("../fixtures/pages/boxPage.json");
const generalElements = require("../fixtures/pages/general.json");
const dashboardPage = require("../fixtures/pages/dashboardPage.json");
const invitePage = require("../fixtures/pages/invitePage.json");
const inviteeBoxPage = require("../fixtures/pages/inviteeBoxPage.json");
const inviteeDashboardPage = require("../fixtures/pages/inviteeDashboardPage.json");
import { faker } from "@faker-js/faker";

describe("user can create a box and run it", () => {
  //пользователь 1 логинится
  //пользователь 1 создает коробку
  //пользователь 1 получает приглашение
  //пользователь 2 переходит по приглашению
  //пользователь 2 заполняет анкету
  //пользователь 3 переходит по приглашению
  //пользователь 3 заполняет анкету
  //пользователь 4 переходит по приглашению
  //пользователь 4 заполняет анкету
  //пользователь 1 логинится
  //пользователь 1 запускает жеребьевку
  let newBoxName = faker.word.noun({ length: { min: 5, max: 10 } });
  let maxAmount = faker.random.numeric(3);
  let currency = "Евро";
  let inviteLink;
  let boxId;
  let i;

  it("user logins and create a box", () => {
    cy.visit("login");
    cy.login(users.userAutor.email, users.userAutor.password);
    cy.contains("Создать коробку").click();
    cy.get(boxPage.boxNameField).type(newBoxName);
    cy.get(boxPage.idField)
      .invoke("attr", "value")
      .then((text) => {
        boxId = text;
      });
    cy.get(generalElements.arrowRight).click();
    cy.get(boxPage.sixthIcon).click();
    cy.get(generalElements.arrowRight).click();
    cy.get(boxPage.giftPriceToggle).click();
    cy.get(boxPage.maxAnount).type(maxAmount);
    cy.get(boxPage.currency).select(currency);
    cy.get(generalElements.arrowRight).click();
    cy.get(generalElements.arrowRight).click();
    cy.get(generalElements.arrowRight).click();
    cy.get(dashboardPage.createdBoxName).should("have.text", newBoxName);
    cy.get(".layout-1__header-wrapper-fixed .toggle-menu-item span")
      .invoke("text")
      .then((text) => {
        expect(text).to.include("Участники");
        expect(text).to.include("Моя карточка");
        expect(text).to.include("Подопечный");
      });
  });

  it("add participants", () => {
    cy.get(generalElements.submitButton).click();
    cy.get(invitePage.inviteLink)
      .invoke("text")
      .then((link) => {
        inviteLink = link;
      });
    cy.clearCookies();
  });

  it("adding participants", () => {
    for (let i = 1; i < 4; i++) { 
    cy.visit(inviteLink);
    cy.inviteLinkAddingParticipant(i);
    cy.clearCookies();
  }
  });

  it('draw', () => {
    cy.visit("login");
    cy.login(users.userAutor.email, users.userAutor.password);
    cy.get(invitePage.boxesButton).click();
    cy.contains(boxId).click();
    cy.get(dashboardPage.greenTip)
      .invoke("text")
      .then((text) => {
        expect(text).to.include("В коробке уже достаточно участников для проведения жеребьевки.");
    })
    cy.get(dashboardPage.drawLink).click();
    cy.get(generalElements.submitButton).click();
    cy.get(generalElements.submitButton).click();
    cy.get(dashboardPage.drawSuccessLayer)
      .invoke("text")
      .then((text) => {
        expect(text).to.include("Жеребьевка проведена");
  })
  });

  after("delete box", () => {
    cy.deletingBox(boxId);
  });
});
