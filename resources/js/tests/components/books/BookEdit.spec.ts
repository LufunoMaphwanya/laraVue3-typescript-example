
import { mount, shallowMount, flushPromises } from "@vue/test-utils";
import BookEdit from "../../../components/books/BookEdit.vue";
import router from "../../../router";
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

const testId = '3';
const fakeBook = { "id": "3", "title": "book1", "subtitle": "hello1", "year": 1938, 'author': 'A', 'publisher': 'A', 'genre': ''}
const fakeData = Promise.resolve({"data":{"data": fakeBook}});


describe("BookEdit.vue", () => {

    beforeEach(() => {
    })

  it("correctly prepopulates form with correct existing data", async () => {

    mockedAxios.get.mockReturnValueOnce(fakeData);

    const wrapper = shallowMount(BookEdit, {
    propsData: {
        id: testId
    },
      global: {
        plugins: [router],
      }
    } as any);

    expect(axios.get).toBeCalledWith("/api/books/"+testId);

    await flushPromises();

    const titleInputField: HTMLInputElement = wrapper.find('#title').element as HTMLInputElement;
    const yearInputField: HTMLInputElement = wrapper.find('#year').element as HTMLInputElement;

    const prepopTitle = titleInputField.value;
    const prepopYear = yearInputField.value;

    expect(prepopTitle).toBe(fakeBook.title);
    expect(prepopYear).toBe(`${fakeBook.year}`);
  });

});
