import { ref } from 'vue'
import axios from "axios";

export default function useBooks() {
    const books = ref([])
    const book = ref([])

    const getBooks = async () => {
        const response = await axios.get('/api/books');
        books.value = response.data.data;
    }

    const getBook = async (id: number) => {
        let response = await axios.get('/api/books/' + id)
        book.value = response.data.data;
    }

    return {
        books,
        book,
        getBook,
        getBooks
    }
}
