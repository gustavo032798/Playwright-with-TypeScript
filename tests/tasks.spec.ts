import { expect, test } from "@playwright/test"
import { TaskModel } from "./fixtures/task.model"
import { deleteTaskByHelper, postTask } from "./support/helpers"
import { TasksPage } from "./support/pages/tasks"
import data from './fixtures/tasks.json'

let tasksPage: TasksPage

test.beforeEach(({ page }) => {
  tasksPage = new TasksPage(page)
})

test.describe('cadastro', () => {
  test('deve poder cadastrar uma nova tarefa', async ({ request }) => {
    const task = data.success as TaskModel

    await deleteTaskByHelper(request, task.name)

    await tasksPage.go()
    await tasksPage.create(task)
    await tasksPage.shouldHaveText(task.name)
  })

  test('não deve permitir cadastro de tarefa duplicada', async ({ request }) => {
    const task = data.duplicate as TaskModel

    await deleteTaskByHelper(request, task.name)
    await postTask(request, task)

    await tasksPage.go()
    await tasksPage.create(task)
    await tasksPage.alertHaveText('Task already exists!')
  })

  test('mensagem de campo obrigatório ao tentar cadastrar tarefa vazia', async () => {
    const task = data.required as TaskModel

    await tasksPage.go()
    await tasksPage.create(task)
    await tasksPage.alertRequiredField('This is a required field')
  })
})

test.describe('atualização', () => {
  test('deve concluir uma tarefa', async ({ request }) => {
    const task = data.update as TaskModel

    await deleteTaskByHelper(request, task.name)
    await postTask(request, task)

    await tasksPage.go()
    await tasksPage.checkTask(task.name)
    await tasksPage.shouldBeDone(task.name)
  })
})

test.describe('remoção', () => {
  test('deve excluir uma tarefa', async ({ request }) => {
    const task = data.delete as TaskModel

    await deleteTaskByHelper(request, task.name)
    await postTask(request, task)

    await tasksPage.go()
    await tasksPage.deleteTask(task.name)
    await tasksPage.shouldNotExist(task.name)
  })
})