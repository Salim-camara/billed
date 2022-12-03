/**
 * @jest-environment jsdom
 */

import { screen, waitFor } from "@testing-library/dom";
import BillsUI from "../views/BillsUI.js";
import { bills } from "../fixtures/bills.js";
import store from "../app/Store";
import { localStorageMock } from "../__mocks__/localStorage.js";
import {
  toHaveStyle,
  toHaveBeenCalled,
  toHaveClass,
} from "@testing-library/jest-dom";
import { ROUTES, ROUTES_PATH } from "../constants/routes.js";
import BillsContainer from "../containers/Bills.js";
import NewBillContainer from "../containers/NewBill.js";
import userEvent from "@testing-library/user-event";
import mockStore from "../__mocks__/store";
import router from "../app/Router.js";

describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", async () => {
      Object.defineProperty(window, "localStorage", {
        value: localStorageMock,
      });
      window.localStorage.setItem(
        "user",
        JSON.stringify({
          type: "Employee",
        })
      );
      const root = document.createElement("div");
      root.setAttribute("id", "root");
      document.body.append(root);
      router();
      window.onNavigate(ROUTES_PATH.Bills);
      await waitFor(() => screen.getByTestId("icon-window"));
      const windowIcon = screen.getByTestId("icon-window");
      //to-do write expect expression
      expect(windowIcon.classList.contains("active-icon")).toBeTruthy();
    });

    test("Then bills should be ordered from earliest to latest", () => {
      document.body.innerHTML = BillsUI({ data: bills });
      const dates = screen
        .getAllByText(
          /^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i
        )
        .map((a) => a.innerHTML);
      const antiChrono = (a, b) => (a < b ? 1 : -1);
      const datesSorted = [...dates].sort(antiChrono);
      expect(dates).toEqual(datesSorted);
    });

    test("check if modal is diplayed", async () => {
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname });
      };
      document.body.innerHTML = BillsUI({ data: bills });
      const bills2 = new BillsContainer({
        document,
        onNavigate,
        localStorage: window.localStorage,
      });
      const handleClickIconEye = jest.fn((icon) =>
        bills2.handleClickIconEye(icon)
      );
      const modaleFile = document.getElementById("modaleFile");
      const iconEye = screen.getAllByTestId("icon-eye");
      $.fn.modal = jest.fn(() => modaleFile.classList.add("show"));
      iconEye.forEach((icon) => {
        icon.addEventListener("click", handleClickIconEye(icon));
        userEvent.click(icon);
        expect(handleClickIconEye).toHaveBeenCalled();
      });
      expect(modaleFile).toHaveClass("show");
    });

    test("check redirection on NewBill page", async () => {
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname });
      };
      const bills = new BillsContainer({
        document,
        onNavigate,
        mockStore,
        localStorage,
      });
      const handleClickNewBill = jest.fn((e) => bills.handleClickNewBill(e));
      const addNewBill = screen.getByTestId("btn-new-bill");
      addNewBill.addEventListener("click", handleClickNewBill);
      userEvent.click(addNewBill);
      expect(handleClickNewBill).toHaveBeenCalled();
      expect(screen.queryByText("Envoyer une note de frais")).toBeTruthy();
    });

    // test("Then fetches bills from mock API GET", async () => {
    //   localStorage.setItem(
    //     "user",
    //     JSON.stringify({ type: "Admin", email: "test@test.fr" })
    //   );
    //   const billsContain = new BillsContainer({
    //     document,
    //     onNavigate,
    //     store,
    //     localStorage: window.localStorage,
    //   });
    //   document.body.innerHTML = BillsUI({ data: bills });
    //   console.log('l113 ', billsContain)
    //   // billsContain.getBills();
    //   // await waitFor(() => screen.getByText("Mes notes de frais"));
    //   expect(screen.getByText("Mes notes de frais")).toBeTruthy();
    // });
  });
});
