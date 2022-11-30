/**
 * @jest-environment jsdom
 */

import { screen } from "@testing-library/dom";
import NewBillUI from "../views/NewBillUI.js";
import NewBill from "../containers/NewBill.js";

describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("Then i click on submit without complet form", () => {
      const html = NewBillUI();
      document.body.innerHTML = html;
      console.log("l15", html);
      //to-do write assertion
      const newBills = new NewBill({
        document,
        onNavigate,
        store,
        localStorage,
      });
      const inputFile = document.querySelector("#btn-send-bill");
      inputFile.click();
    });
  });
});
