import { ref } from 'vue';
import axios from "axios";
import { useRouter } from 'vue-router';

export default function useBooks() {
    const books = ref([])
    const book = ref([])
    const errors = ref('')
    const router = useRouter()

    const authors = [ 'Terry A', 'Steven Price', 'John Smith', 'John Kennedy','Bryan Promise', 'Kyle David'];
    const publishers = [ 'Publisher A', 'Publisher B', 'Publisher C', 'Publisher D'];
    const genres = ['Fiction', 'Non-Fiction', 'Business', 'Horror','Other'];

    const getBooks = async () => {
        const response = await axios.get('/api/books');
        books.value = response.data.data;
    }

    const getBook = async (id: number) => {
        let response = await axios.get('/api/books/' + id)
        book.value = response.data.data;
    }

    const storeBook = async (data: object) => {
        errors.value = ''
        try {
            await axios.post('/api/books', data)
            await router.push({name: 'books.index'})
        } catch (e: any) {
            if (e.response.status === 422) {
                errors.value = e.response.data.errors
            }
        }
    }

    return {
        authors,
        publishers,
        genres,
        errors,
        books,
        book,
        getBook,
        getBooks,
        storeBook
    }
}
