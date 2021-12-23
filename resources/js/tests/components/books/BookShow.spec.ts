
import { mount, shallowMount, flushPromises } from "@vue/test-utils";
import BookShow from "../../../components/books/BookShow.vue";
import router from "../../../router";
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;
const mockedAxios2 = axios as jest.Mocked<typeof axios>;

const testId = '3';
const fakeBook = { "id": "3", "title": "book1", "subtitle": "hello1", "year": 1938, 'author': 'A', 'publisher': 'A', 'genre': ''}
const fakeData = Promise.resolve({"data":{"data": fakeBook}});


describe("BookShow.vue", () => {

    beforeEach(() => {
    })

    afterEach(() => {
        jest.clearAllMocks();
      });

  it("correctly mounts with correct data", async () => {

    mockedAxios.get.mockReturnValueOnce(fakeData);

    const wrapper = shallowMount(BookShow, {
    propsData: {
        id: testId
    },
      global: {
        plugins: [router],
      }
    } as any);

    expect(axios.get).toBeCalledWith("/api/books/"+testId);

    await flushPromises();
    expect(wrapper.vm.book.id).toBe(testId);
  });

  it("shows user delete dialog on delete click.", async () => {

    mockedAxios.get.mockReturnValueOnce(fakeData);
    window.confirm = jest.fn(); // mock window.confirm implementation

    const wrapper = shallowMount(BookShow, {
    propsData: {
        id: testId
    },
      global: {
        plugins: [router],
      }
    } as any);

    await flushPromises();


    const button: HTMLElement = wrapper.find('#deleteBtn').element as HTMLElement;
    button.click();

    expect(window.confirm).toBeCalledWith(`delete  ${fakeBook.title}?`)
  });
});
