/**
 * @jest-environment jsdom
 */

import { screen, waitFor, fireEvent, toHaveClass } from "@testing-library/dom";
import NewBillUI from "../views/NewBillUI.js";
import NewBill from "../containers/NewBill.js";
import userEvent from "@testing-library/user-event";
import { localStorageMock } from "../__mocks__/localStorage.js";
import mockStore from "../__mocks__/store";
import store from "../app/Store.js";

jest.mock("../app/store", () => mockStore);

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
            email: "test@test.fr",
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
    test("The i change file", () => {
      console.log("l47 ", store.bills);
      window.localStorage.setItem(
        "user",
        JSON.stringify({
          type: "Employee",
        })
      );
      const newBillInit = new NewBill({
        document,
        onNavigate,
        store,
        localStorage: window.localStorage,
      });
      const file = new File(["image"], "image.png", { type: "image/png" });
      const handleChangeFile = jest.fn((e) => newBillInit.handleChangeFile(e));
      const billFile = screen.getByTestId("file");
      billFile.addEventListener("change", handleChangeFile);
      userEvent.upload(billFile, file);
      expect(billFile.files[0].name).toBeDefined();
      expect(handleChangeFile).toBeCalled();
    });
  });
});
