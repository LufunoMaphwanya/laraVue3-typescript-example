
import { mount, shallowMount, flushPromises } from "@vue/test-utils";
import BookCreate from "../../../components/books/BookCreate.vue";
import router from "../../../router";

describe("BookIndex.vue", () => {

    beforeEach(() => {
    })

  it("allows submit when all values are set", async () => {
    const wrapper = shallowMount(BookCreate, {
      global: {
        plugins: [router],
      }
    } as any);

    await wrapper.find('#title').setValue('test title');
    await wrapper.find('#year').setValue(1994);
    await wrapper.find('#publisher').setValue('test p');
    await wrapper.find('#author').setValue('test a');
    await wrapper.find('#genre').setValue('test g');

    expect(wrapper.vm.submittable).toBe(true);
  });

  it("disallows submit when all values are set", async () => {
    const wrapper = shallowMount(BookCreate, {
      global: {
        plugins: [router],
      }
    } as any);

    expect(wrapper.vm.submittable).toBe(false);
  });
});
