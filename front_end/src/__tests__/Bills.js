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
import NewBillContainer from "../containers/NewBill.js";
import userEvent from '@testing-library/user-event';

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
      const windowIcon = screen.getByTestId('icon-window')
      //to-do write expect expression
      expect(windowIcon.classList.contains("active-icon")).toBeTruthy()
    })

    test("Then bills should be ordered from earliest to latest", () => {
      document.body.innerHTML = BillsUI({ data: bills })
      const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
      const antiChrono = (a, b) => ((a < b) ? 1 : -1)
      const datesSorted = [...dates].sort(antiChrono)
      expect(dates).toEqual(datesSorted)
    })

    test('check if modal is diplayed', async () => {
      const billsInstance = new BillsContainer({ document, onNavigate, store, localStorage })
      const iconEye = screen.getAllByTestId('icon-eye')
      console.log('l46 ', iconEye[0])
      await waitFor(() => screen.getByTestId('modal2'))
      billsInstance.handleClickIconEye(iconEye[0])
      // userEvent.click(iconEye[0])
      // await waitFor(() => screen.findBy('modal2'))
      setTimeout(() => {
        expect(screen.getByTestId('modal2').classList.contains("show")).toBeTruthy()
      }, 1000)
    })

    
    test('test2', async () => {
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.Bills)
      await waitFor(() => screen.getByTestId('btn-new-bill'))
      userEvent.click(screen.getByTestId('btn-new-bill'))
      console.log('l66 ', window.location.hash)
      expect(window.location.hash).toBe('#employee/bill/new')
      // console.log('l63 ', document.body.innerHTML)
    })


    // test('', () => {
    //   const billsContainerInstance = new BillsContainer({ document, onNavigate, store, localStorage })
    //   const dates = 5
    //   console.log('l59 ', billsContainerInstance.getBills())
    //   expect(dates).toEqual(5)
    // })
  })
})
