/**
 * @jest-environment jsdom
 */

import {screen, waitFor} from "@testing-library/dom"
import BillsUI from "../views/BillsUI.js"
import { bills } from "../fixtures/bills.js"
import store from "../app/Store"
import { ROUTES_PATH} from "../constants/routes.js";
import {localStorageMock} from "../__mocks__/localStorage.js";
import BillsContainer from "../containers/Bills.js"

import router from "../app/Router.js";

describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", async () => {

      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.Bills)
      await waitFor(() => screen.getByTestId('icon-window'))
      await waitFor(() => screen.getByTestId('btn-new-bill'))
      const windowIcon = screen.getByTestId('icon-window')
      const btnNewBill = screen.getByTestId('btn-new-bill')
      //to-do write expect expression
      expect(windowIcon.classList.contains("active-icon")).toBeTruthy()
      // expect(btnNewBill.classList.contains("btn-primary")).toBeTruthy()


    })
    test("Then bills should be ordered from earliest to latest", () => {
      document.body.innerHTML = BillsUI({ data: bills })
      const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
      const antiChrono = (a, b) => ((a < b) ? 1 : -1)
      const datesSorted = [...dates].sort(antiChrono)
      console.log('36', datesSorted)
      console.log('37', dates)
      expect(dates).toEqual(datesSorted)
    })

    test('Test', () => {
      const billsContainerInstance = new BillsContainer({ document, onNavigate, store, localStorage })
      expect(billsContainerInstance.test1()).toBeTruthy()
      expect(billsContainerInstance.test2()).toBeTruthy()

    })

    test('test2', () => {
      const billsContainerInstance = new BillsContainer({ document, onNavigate, store, localStorage })
      const iconEye = document.querySelectorAll(`div[data-testid="icon-eye"]`)
      iconEye[0].click()
      const modal = document.querySelector(`#modaleFile`)
      console.log('60 ', modal)
      expect(modal.classList.contains("show")).toBeTruthy()

    })
  })
})
