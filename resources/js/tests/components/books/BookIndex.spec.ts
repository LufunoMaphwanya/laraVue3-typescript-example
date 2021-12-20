
import { mount, shallowMount, flushPromises } from "@vue/test-utils";
import BookIndex from "../../../components/books/BookIndex.vue";
import router from "../../../router";
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

const fakeBooks = [{ "id": "1", "title": "book1", "subtitle": "hello1", "year": 1938, 'author': 'A', 'publisher': 'A', 'genre': ''}, { "id": "1", "title": "book1", "subtitle": "hello1", "year": 1938, 'author': 'A', 'publisher': 'A', 'genre': ''}, { "id": "1", "title": "book1", "subtitle": "hello1", "year": 1938, 'author': 'A', 'publisher': 'A', 'genre': ''}];
const fakeData = Promise.resolve({"data": {"data": fakeBooks}});

describe("BookIndex.vue", () => {

    beforeEach(() => {
    })

  it("correctly mounts with correct data", async () => {

    mockedAxios.get.mockReturnValueOnce(fakeData);

    const wrapper = shallowMount(BookIndex, {
      global: {
        plugins: [router],
      }
    } as any);

    expect(axios.get).toBeCalledWith("/api/books");

    await flushPromises();
    expect(wrapper.vm.books.length).toBe(3);
  });

});
