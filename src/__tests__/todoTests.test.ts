
import {
  Builder,
  By,
  Capabilities,
  until,
  WebDriver,
} from "selenium-webdriver";
const chromedriver = require("chromedriver");

const driver: WebDriver = new Builder()
  .withCapabilities(Capabilities.chrome())
  .build();

class TodoPage {
  todoInput: By = By.className("new-todo");
  todos: By = By.css("li.todo");
  todoLabel: By = By.css("label");
  todoComplete: By = By.css("input");
  todoStar: By = By.className("star");
  starBanner: By = By.className("starred");
  todoCount: By = By.className("todo-count");
  clearCompletedButton: By = By.css("button.clear-completed");

  driver: WebDriver;
  url: string = "https://devmountain.github.io/qa_todos/";

  constructor(driver: WebDriver) {
    this.driver = driver;
  }
}
const getValue = new TodoPage(driver);

describe("the todo app", () => {
  beforeEach(async () => {
    await driver.get(getValue.url);
  });
  afterAll(async () => {
    // await driver.quit();
  });
  it("Add a todo", async () => {
    await driver.wait(until.elementLocated(getValue.todoInput));
    // await driver.findElement(getValue.todoInput).sendKeys("Banana\n");
    await driver.findElement(getValue.todoInput).sendKeys("Apple\n");
  });
  it("Remove a todo", async () => {
    let myTodos = await driver.findElements(getValue.todos);
    await myTodos
      .filter(async (todo) => {
        (await (await todo.findElement(getValue.todoLabel)).getText()) ==
          "Banana";
      })[0]
      .findElement(getValue.todoComplete)
      .click();
    await (await driver.findElement(getValue.clearCompletedButton)).click();
    myTodos = await driver.findElements(getValue.todos);
    let myTodo = await myTodos.filter(async (todo) => {
      (await (await todo.findElement(getValue.todoLabel)).getText()) == "Banana";
    });
    expect(myTodo.length).toEqual(0);
  });
  it("Mark a todo with a star", async () => {

    await driver.wait(until.elementLocated(getValue.todoInput));
    let startingStars = await (await driver.findElements(getValue.starBanner)).length;
    await driver.findElement(getValue.todoInput).sendKeys("Ice Cream\n");
    await (await driver.findElements(getValue.todos))
      .filter(async (todo) => {
        (await (await todo.findElement(getValue.todoLabel)).getText()) ==
          "Ice Cream";
      })[0]
      .findElement(getValue.todoStar)
      .click();
    let endingStars = await (await driver.findElements(getValue.starBanner)).length;
    expect(endingStars).toBeGreaterThan(startingStars);
  });
  it("has the right number of todos listed", async () => {
  
    await driver.wait(until.elementLocated(getValue.todoInput));

    let startingTodoCount = await (await driver.findElements(getValue.todos)).length;

    await driver.findElement(getValue.todoInput).sendKeys("Bacon \n");
    await driver.findElement(getValue.todoInput).sendKeys("Eggs \n");
    await driver.findElement(getValue.todoInput).sendKeys("Milk \n");
    await driver.findElement(getValue.todoInput).sendKeys("Mango \n");

    let endingTodoCount = await (await driver.findElements(getValue.todos)).length;

    let message = await (await driver.findElement(getValue.todoCount)).getText();

    expect(endingTodoCount - startingTodoCount).toBe(4);
    expect(message).toBe(`${endingTodoCount} items left`);
  });
});