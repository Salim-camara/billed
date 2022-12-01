/**
 * @jest-environment jsdom
 */

import { screen, waitFor, fireEvent, toHaveClass } from "@testing-library/dom";
import NewBillUI from "../views/NewBillUI.js";
import NewBill from "../containers/NewBill.js";

const onNavigate = (pathname) => {
  document.body.innerHTML = ROUTES({ pathname });
};

describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    describe("When i send information with correct format", () => {
      test("Then i submit the form", async () => {
        const html = NewBillUI();
        document.body.innerHTML = html;
        const newBill1 = new NewBill({
          document,
          onNavigate,
          localStorage: window.localStorage,
        });
        localStorage.setItem(
          "user",
          JSON.stringify({
            type: "Employee",
            email: "a@a",
          })
        );
        const formNewBill = screen.getByTestId("form-new-bill");
        expect(formNewBill).toBeTruthy();
        const handleSubmit = jest.fn((e) => newBill1.handleSubmit(e));
        formNewBill.addEventListener("submit", handleSubmit);
        fireEvent.submit(formNewBill);
        expect(handleSubmit).toHaveBeenCalled();
      });
    });
  });
});
