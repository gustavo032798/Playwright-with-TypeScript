import { Page, expect, Locator } from "@playwright/test"
import { TaskModel } from "../../../fixtures/task.model"

export class TasksPage {
  readonly page: Page
  readonly inputTaskName: Locator

  constructor(page: Page) {
    this.page = page
    this.inputTaskName = page.locator('input[class*=InputNewTask]')
  }

  async go() {
    await this.page.goto('/')
  }

  async create(task: TaskModel) {
    await this.inputTaskName.fill(task.name)

    // await page.click('xpath=//button[contains(text(), "Create")]')
    await this.page.click('css=button >> text=Create')
  }

  async checkTask(text: string) {
    const task = this.page.locator(`//p[text()="${text}"]/..//button[contains(@class, "Toggle")]`)
    await task.click()
  }

  async deleteTask(text: string) {
    const task = this.page.locator(`//p[text()="${text}"]/..//button[contains(@class, "Delete")]`)
    await task.click()
  }

  async shouldHaveText(taskName: string) {
    // const target = page.getByTestId('task-item')
    const target = this.page.locator(`css=.task-item p >> text=${taskName}`)
    await expect(target).toBeVisible()
  }

  async shouldNotExist(taskName: string) {
    const target = this.page.locator(`css=.task-item p >> text=${taskName}`)
    await expect(target).not.toBeVisible()
  }

  async alertHaveText(text: string) {
    const target = this.page.locator('#swal2-html-container')
    await expect(target).toHaveText(text)
  }

  async alertRequiredField(text: string) {
    const validationMessage = await this.inputTaskName.evaluate(e => (e as HTMLInputElement).validationMessage)
    await expect(validationMessage).toEqual(text)
  }

  async shouldBeDone(text: string) {
    const target = this.page.getByText(text)
    await expect(target).toHaveCSS('text-decoration-line', 'line-through')
  }
}