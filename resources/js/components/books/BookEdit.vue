<template>
    <div class="container">
        <form @submit.prevent="editBook">
            <div class="form-group">
                <label>Title: </label>
                <input id="title" type="text" class="form-control" placeholder="book title" v-model="book.title">
            </div>
            <div class="form-group">
                <label>Year: </label>
                <input type="text" class="form-control" placeholder="book year" v-model="book.year" id="year">
            </div>
            <div class="form-group">
                <label>Author: </label>
                <select class="form-control" v-model="book.author" id="author">
                <option v-for="author in authors" :key="author">{{ author }}</option>
                </select>
            </div>
            <div class="form-group">
                <label>Publisher: </label>
                <select class="form-control" v-model="book.publisher" id="publisher">
                <option v-for="publisher in publishers" :key="publisher">{{ publisher }}</option>
                </select>
            </div>
            <div class="form-group">
                <label>Genre: </label>
                <select class="form-control"  v-model="book.genre" id="genre">
                <option v-for="genre in genres" :key="genre">{{ genre }}</option>
                </select>
            </div>
            <div class="form-group"><br/>
                <button type="submit" class="btn btn-primary">Save</button>
            </div>
        </form>
    </div>
</template>

<script lang='ts'>
import useBooks from '../../composables/books';
import { onMounted, computed } from 'vue';

export default {
    props: {
       id: {
           required: true,
           type: String
       }
   },
    setup(props: any) {
        const { errors, authors, publishers, genres, book, getBook, updateBook } = useBooks();

        onMounted(() => getBook(props.id))


        const editBook = async () => {
            await updateBook(props.id);
        }

        return {
            book,
            errors,
            editBook,
            authors,
            publishers,
            genres
        }
    }
}
</script>
