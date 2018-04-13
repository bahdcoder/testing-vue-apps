import App from '@/App.vue'
import { mount } from '@vue/test-utils'
import flushPromises from 'flush-promises'

describe('App.vue', () => {
  it('displays a list of todos when component is mounted', async () => {
    // Mount the component
    const wrapper = mount(App)
    // Wait for fetchTodos function to resolve with list of todos
    await flushPromises()

    // Find the unordered list
    const todosList = wrapper.find('[data-testid="todos"]')

    // Expect that the unordered list should have two children
    expect(todosList.element.children.length).toBe(2)
  })

  it('deletes a todo and removes it from the list', async () => {
    // Mount the component
    const wrapper = mount(App)

    // wait for the fetchTodos function to resolve with the list of todos.
    await flushPromises()

    // Find the unordered list and expect that there are two children
    expect(wrapper.find('[data-testid="todos"]').element.children.length).toBe(2)

    // Find the delete button for the first to-do item and trigger a click event on it.
    wrapper.find('[data-testid="delete-button-1"]').trigger('click')

    // Wait for the deleteTodo function to resolve.
    await flushPromises()

    // Find the unordered list and expect that there is only one child
    expect(wrapper.find('[data-testid="todos"]').element.children.length).toBe(1)

    // expect that the deleted todo does not exist anymore on the list
    expect(wrapper.contains(`[data-testid="todo-1"]`)).toBe(false)
  })

  // app.spec.js

  it('creates a new todo item', async () => {
    const NEW_TODO_TEXT = 'BUY A PAIR OF SHOES FROM THE SHOP'

    // mount the App component
    const wrapper = mount(App)

    // wait for fetchTodos function to resolve
    await flushPromises()

    // find the input element for creating new todos
    const todoInput = wrapper.find('[data-testid="todo-input"]')

    // get the element, and set its value to be the new todo text
    todoInput.element.value = NEW_TODO_TEXT

    // trigger an input event, which will simulate a user typing into the input field.
    todoInput.trigger('input')

    // hit the enter button to trigger saving a todo
    todoInput.trigger('keyup.enter')

    // wait for the saveTodo function to resolve
    await flushPromises()

    // expect the the number of elements in the todos unordered list has increased to 3
    expect(wrapper.find('[data-testid="todos"]').element.children.length).toBe(3)

    // since our axios.post mock returns a todo with id of 3, we expect to find this element in the DOM, and its text to match the text we put into the input field.
    expect(wrapper.find('[data-testid="todo-3"]').text())
      .toMatch(NEW_TODO_TEXT)
  })

  it('updates a todo item', async () => {
    const UPDATED_TODO_TEXT = 'UPDATED TODO TEXT'

    // Mount the component
    const wrapper = mount(App)

    // Wait for the fetchTodos function to resolve
    await flushPromises()

    // Simulate a click on the edit button of the first to-do item
    wrapper.find('[data-testid="edit-button-1"]').trigger('click')

    // make sure the list of todos is hidden after clicking the edit button
    expect(wrapper.contains('[data-testid="todos"]')).toBe(false)

    // find the todo input
    const todoInput = wrapper.find('[data-testid="todo-input"]')

    // set its value to be the updated texr
    todoInput.element.value = UPDATED_TODO_TEXT

    // trigger the input event, similar to typing into the input field
    todoInput.trigger('input')

    // Trigger the keyup event on the enter button, which will call the updateTodo function
    todoInput.trigger('keyup.enter')

    // Wait for the updateTodo function to resolve.
    await flushPromises()

    // Expect that the list of todos is displayed again
    expect(wrapper.contains('[data-testid="todos"]')).toBe(true)

    // Find the todo with the id of 1 and expect that its text matches the new text we typed in.
    expect(wrapper.find('[data-testid="todo-1"]').text()).toMatch(UPDATED_TODO_TEXT)
  })

})
