<template>
    <div class="container">
        <form @submit.prevent="saveBook">
            <div class="form-group">
                <label>Title: </label>
                <input id="title" type="text" class="form-control" placeholder="book title" v-model="form.title">
            </div>
            <div class="form-group">
                <label>Year: </label>
                <input type="text" class="form-control" placeholder="book year" v-model="form.year" id="year">
            </div>
            <div class="form-group">
                <label>Author: </label>
                <select class="form-control" v-model="form.author" id="author">
                <option v-for="author in authors" :key="author">{{ author }}</option>
                </select>
            </div>
            <div class="form-group">
                <label>Publisher: </label>
                <select class="form-control" v-model="form.publisher" id="publisher">
                <option v-for="publisher in publishers" :key="publisher">{{ publisher }}</option>
                </select>
            </div>
            <div class="form-group">
                <label>Genre: </label>
                <select class="form-control"  v-model="form.genre" id="genre">
                <option v-for="genre in genres" :key="genre">{{ genre }}</option>
                </select>
            </div>
            <div class="form-group"><br/>
                <button :disabled="!submittable" type="submit" class="btn btn-primary">Save</button>
            </div>
        </form>
    </div>
</template>

<script lang='ts'>
import useBooks from '../../composables/books';
import { reactive, computed } from 'vue';

export default {
    setup() {
        const { errors, storeBook, authors, publishers, genres } = useBooks();

        const form = reactive({
            title: '',
            author: '',
            publisher: '',
            genre: '',
            year: null
        })

        const submittable = computed(() => {
            return form.title !== '' && form.author !== ''
            && form.publisher !== '' && form.genre !== '' && form.year !== null;
        });


        const saveBook = async () => {
            await storeBook({ ...form })
        }

        return {
            form,
            errors,
            saveBook,
            authors,
            publishers,
            genres,
            submittable
        }
    }
}
</script>
