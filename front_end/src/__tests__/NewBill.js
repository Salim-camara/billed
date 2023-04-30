/**
 * @jest-environment jsdom
 */

import { screen, waitFor, fireEvent, toHaveClass } from "@testing-library/dom";
import NewBillUI from "../views/NewBillUI.js";
import NewBill from "../containers/NewBill.js";
import BillsUI from "../views/BillsUI.js";
import userEvent from "@testing-library/user-event";
import { localStorageMock } from "../__mocks__/localStorage.js";
import mockStore from "../__mocks__/store";
import { ROUTES, ROUTES_PATH } from "../constants/routes.js";
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
          store,
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
        await waitFor(() => screen.getByTestId("btn-new-bill"));
      });

      // test post
      describe("When I submit a new Bill on correct format", () => {
        test("Then the submit should success", () => {
          const html = NewBillUI();
          document.body.innerHTML = html;
          const newBill1 = new NewBill({
            document,
            onNavigate,
            store,
            localStorage: window.localStorage,
          });
          const formNewBill = screen.getByTestId("form-new-bill");
          expect(formNewBill).toBeTruthy();
          const handleSubmit = jest.fn((e) => newBill1.handleSubmit(e));
          formNewBill.addEventListener("submit", handleSubmit);
          fireEvent.submit(formNewBill);
          expect(handleSubmit).toHaveBeenCalled();
        });
        describe("When an error occurs", () => {
          test("should fail with 500 message error", async () => {
            jest.spyOn(mockStore, "bills");
            Object.defineProperty(window, "localStorage", {
              value: localStorageMock,
            });
            window.localStorage.setItem(
              "user",
              JSON.stringify({
                type: "Employee",
                email: "a@a",
              })
            );
            mockStore.bills.mockImplementationOnce(() => {
              return {
                create: () => {
                  return Promise.reject(new Error("Erreur 500"));
                },
              };
            });
            const html = BillsUI({ error: "Erreur 500" });
            document.body.innerHTML = html;
            const message = await screen.getByText(/Erreur 500/);
            expect(message).toBeTruthy();
          });
        });
      });
    });
    test("Then i change file", () => {
      const html = NewBillUI();
      document.body.innerHTML = html;
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
