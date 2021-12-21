<template>
    <div class="container">
        <div class="row">
            <router-link :to="{ name: 'books.create' }" class="text-sm font-medium nav-link">
                <button type="button" class="btn btn-primary">Add book</button>
            </router-link>
        </div>
        <div class="card" style="width: 18rem; float: left; margin: 5px" v-for="book in books" :key="book.id">
            <router-link :to="{ name: 'books.show' , params: { id: book.id }}">
                <div class="card-body">
                        <h5 class="card-title text-center">{{ book.title}}</h5>
                        <h6 class="card-subtitle mb-2 text-muted text-center">Year: {{ book.year}}</h6>
                        <h6 class="card-subtitle mb-2 text-muted text-center">Author: {{ book.author}}</h6>
                        <h6 class="card-subtitle mb-2 text-muted text-center">Pblisher: {{ book.publisher}}</h6>
                        <h6 class="card-subtitle mb-2 text-muted text-center">Genre: {{ book.genre}}</h6>
                </div>
            </router-link>
        </div>
    </div>
</template>

<script lang='ts'>
import useBooks from '../../composables/books';
import { onMounted } from 'vue';

export default {
    setup() {
        const { books, getBooks } = useBooks()
        onMounted(getBooks)

        return {
            books
        }
    }
}
</script>
