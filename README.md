#  Book Store CRUD example laravel vuejs-3
###  Book Store CRUD example with laravel 8 and vuejs-3 composable api ( using typescript)
<br>

#### Our stack:
1. Laravel 8<br />
2. Vue-3 ( using composition api)<br />
3. Typescript for all our front end syntax<br />
4. Front end tests on using jest and Vue-test-utils including setup<br />

####  all set up with laravel mix<br /><br />

You may just pull the complete project or go throught the tutorial with full instructions <br>

Option A - [Set up complete project](#complete-project-set-up)<br>
Option B - [ Go through mini tutorial ( sections skippable )](#tutorial)

## Complete project set up

To set up the complete version of this project


```bash
git clone git@github.com:LufunoMaphwanya/laraVue3-typescript-example.git laravel-online-books
cd laravel-online-books
```

Create .env file
```bash
cp .env.example .env
```

.env <br>
Default is mySQL but you can use whatever you like.
```config
APP_NAME="Online books"
...
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=<YOUR_DB>
DB_USERNAME=<YOUR_DB_USER>
DB_PASSWORD=<YOUR_DB_PASSWORD>

...
```

download project dependencies 
```bash
composer install
php artisan migrate
```

install front end dependencies and run laravel mix
```bash
npm install 
npm run dev
```
Serve your application  :-)
```bash
php artisan key:generate
php artisan serve
```

it should be available http://localhost:8000/home

<img src="https://github.com/LufunoMaphwanya/laravel-8-vuejs-3-typescript-with-jests-online-bookstore/blob/main/github/test-img-1.png?raw=true" width="590">

Run front end tests
```bash
npm run test
```

Run project with test data 
```bash
php artisan migrate:fresh --seed
```

<img src="https://github.com/LufunoMaphwanya/laravel-8-vuejs-3-typescript-with-jests-online-bookstore/blob/main/github/test-img-2.png?raw=true" width="590">

And there you go.... <br>
You can go ahead and customize as you please. <br><br>

# Tutorial 
  book-store example app

## Creating a Laravel online bookstore 
### Backend 
1. - [Set up laravel project](#set-up-laravel-project)<br>
2. - [Models ](#models)<br>
3. - [Seed the database with test data ( optional ) ](#seed-the-database-with-test-data)<br>
3. - [Controllers and routes ](#controllers-and-routes)<br>


### Frontend 

1. [Set up our vue3 frontend](#set-up-our-frontend)<br>
2. [Adding components - vue-compositions api based](#add-get-components)<br>
3. [Add vue tests](#add-vue-component-tests)<br>
4. [Add BookCreate tdd](#add-bookcreate-tdd)<br>
5. [Add BookEdit tdd](#add-bookedit-tdd)<br>
6. [Add BookDelete tdd](#add-bookdelete-tdd)<br>


## 1. Set up laravel project

Let's set up new laravel project
```bash
laravel new laravel-online-books && cd laravel-online-books
```

Create .env file.
```bash
cp .env.example .env
```

.env <br>
Default is mySQL but you can use whatever you like.
```config
APP_NAME="Online books"
...
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=<YOUR_DB>
DB_USERNAME=<YOUR_DB_USER>
DB_PASSWORD=<YOUR_DB_PASSWORD>

...
```
Run composer install and migrate your database 
```bash
composer install
php artisan migrate
```

Set up laravel/ui scaffolding and scaffold ui
```bash
composer require Laravel/ui		
php artisan ui bootstrap
```

```bash
php artisan ui bootstrap --auth
```
```bash
npm install && npm run dev 
```
```bash
php artisan key:generate
php artisan serve
```
<img src="https://github.com/LufunoMaphwanya/laravel-8-vuejs-3-typescript-with-jests-online-bookstore/blob/main/github/test-img-1.png?raw=true" width="590">

		
## 2. Models
Use artisan to generate our model ( -m flag)
```bash
php artisan make:model Book -m
```

This will generate a model and a migration for each of our entities for our application, now let's go ahead and edit them to our specs.<br>
* Book model 
```php
// database/migrations/202x_xxx_create_books_table.php 

public function up()
{
    Schema::create('books', function (Blueprint $table) {
        $table->id();
            $table->string('title');
            $table->integer('year');
            $table->string('genre');
            $table->string('author');
            $table->string('publisher');
            $table->timestamps();
        });
}
public function down()
{
    Schema::dropIfExists('books');
}

// app/models/book.php
class Book extends Model
{
    use HasFactory;

    protected $fillable = [ 'title', 'year', 'genre', 'author', 'publisher'];
}
```

## 3. Seed the database with test data
For now we want to have a bunch of books that we can read online
```bash
php artisan make:seeder BookSeeder
``` 
```php
// database/seeders/BookSeeder.php

<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class BookSeeder extends Seeder
{
    /**
    ...
     */
    public function run()
    {
        for ($x = 0; $x <= 200; $x++) {
            DB::table('books')->insert([
                'year' => rand(1995,2010),
                'title' => "Book title {$x}"
            ]);
        }
    }
}

```
Add this to your application database seeder
```php
// database/seeders/DatabaseSeeder.php

public function run()
    {
        $this->call([
            BookSeeder::class,
            PageSeeder::class
        ]);
    }
```

Finally, migrate db
```bash
php artisan migrate --seed

```



## 3. Controllers and routes

Create the books controller (this will be our library so to speak). 
```bash
php artisan make:controller Api/BookController --resource --api --model=Book
```

Create resources and leave as is. 
```bash
php artisan make:resource BookResource 
```

Create requests and update the rules array as follows 
```bash
php artisan make:request BookRequest 
``` 
```php
// app/Http/Requests/BookRequest.php
public function rules()
{
    return [
        'year' => ['required', 'integer'],
        'title' => ['required', 'string'],
        'genre' => ['required', 'string'],
        'author' => ['required', 'string'],
        'publisher' => ['required', 'string'],
    ];
}

```

Now finally our controller - support CRUD operations. 

App/http/controllers/api/BookController.php
```php

<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\BookRequest;
use App\Http\Resources\BookResource;
use App\Models\Book;

class BookController extends Controller
{
    /**
     * Get all books
     **/
    public function index()
    {
        return BookResource::collection(Book::all());
    }

    /**
     * Store a book
     **/
    public function store(BookRequest $request)
    {
        $book = Book::create($request->validated());
        return new BookResource($book);
    }

    /**
     * Get one book
     **/
    public function show(Book $book)
    {
        return new BookResource($book);
    }

    /**
     * Update a book
     **/
    public function update(BookRequest $request, Book $book)
    {
        $book->update($request->validated());
        return new BookResource($book);
    }

    /**
     * Delete a book
     **/
    public function destroy(Book $book)
    {
        $book->delete();
        return response()->noContent();
    }
}

```

Now let's tie this to our routes
```php
// App/routes/api.php

use App\Http\Controllers\Api\BookController;

// ... 

Route::apiResource('books', BookController::class);
```

Now test this by hitting localhost:8000/api/books


<!-- ### Frontend 

1. [Set up our vue3 frontend](#set-up-our-frontend)<br>
2. [Adding components - vue-compositions api based](#add-get-components)<br>
3. [Add tests components](#add-vue-component-tests)<br>
4. [Add BookCreate tdd](#add-bookcreate-tdd)<br>
5. [Add BookEdit tdd](#add-bookedit-tdd)<br>
6. [Add BookDelete tdd](#add-bookdelete-tdd)<br> -->

## Front end 
### 

## Set up our frontend 

I recommend that you use node version 12 as my set up is. 
```bash
nvm use v12
```

Install vuejs3, vuejs3-loader, vue-router@next and typescript

```bash
npm install --save vue@next vue-router@next vue-loader@next
npm install typescript ts-loader --save-dev
```

Let's start by configuring our typescript as we weill be using typescript for our front end modules.
create tsconfig.json
```json
/* tsconfig.json */ 

{
    "compilerOptions":
    {
        "module": "commonjs",
        "strict": true,
        "jsx": "preserve",
        "moduleResolution": "node"
    }
}
```
Add shims-vue.d.ts file so that typescript can understand our vue files.
```ts
// resources/shims-vue.d.ts
declare module '*.vue' {
    import type { DefineComponent } from 'vue'
    const component: DefineComponent<{}, {}, any>
    export default component
 }
```

enable vue loader for our app
```js
// webpack.mix.js

const mix = require('laravel-mix');
mix.ts('resources/js/app.ts', 'public/js')
    .vue()
    .sass('resources/sass/app.scss', 'public/css')
    .sourceMaps();
 ```

 Now let's configure our vue-router routes
 create router/index.ts
```ts
// resources/js/router/index.ts

import { createRouter, createWebHistory } from 'vue-router';

import BookIndex from '../components/books/BookIndex.vue';
import BookShow from '../components/books/BookShow.vue';

const routes = [
    {
        path: '/home',
        name: 'books.index',
        component: BookIndex
    },
    {
        path: '/books/:id/show',
        name: 'books.show',
        component: BookShow,
        props: true
    },
    { path: "/:pathMatch(.*)", component: { template: "Not found"} }
];

export default createRouter({
    history: createWebHistory(),
    routes
});
```

Now let's create our components. 
BookIndex.vue - for now we will leave it as empty and focus on set up
```vue
// resources/js/components/BookIndex.vue

<template>
    <div class="container">
        empty
    </div>
</template>
```

BookIndex.vue - for now we will leave it as empty and focus on set up
let's create our components 
```vue
// resources/js/components/BookIndex.vue

<template>
    <div class="container">
        empty
    </div>
</template>
```

 let's mount our vue app - make sure to have extension as .ts

```ts
// resources/js/app.ts
require('./bootstrap');

import { createApp } from "vue";
import router from './router';
import BookIndex from './components/books/BookIndex.vue';

const app = createApp({
    components: {
        BookIndex,
    },
}).use(router).mount('#app')

```

Lets's ell our laravel routes use use vue-router for url patterns matching /home
```php
// routes/web.php
...

Route::view('/{any}', 'home')
    ->middleware(['auth'])
    ->where('any', '.*');
...
```

Add <router-view /> in our home blade file
replace {{ you're logged in }} with 
```php
...
   <router-view />
...

```

We're all good, now run
```bash 
npm run dev
```
and retest your application.



## Add get components
#### Vuejs3 composition API
Now there is a lot better rationale on why to use compositions api over options API in your vuejs3 apps<br>
Personally, I have components not clunked up with axios logic,instead I can extract these into a grouped 'composable' that focuses on those mechanics,  <br>
making it easir to maintain my components.
<br>
First we will add our composable books.ts where we will have all our api logic stored.<br>

create resources/js/composables/books.ts
```ts
// resources/js/composables/books.ts

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
 ```

let's update our components 
```vue
// resources/js/components/BookIndex.vue
<template>
    <div class="container">
        <div class="card" style="width: 18rem; float: left; margin: 5px" v-for="book in books" :key="book.id">
            <router-link :to="{ name: 'books.show' , params: { id: book.id }}">
                <div class="card-body">
                        <h5 class="card-title text-center">{{ book.title}}</h5>
                        <h6 class="card-subtitle mb-2 text-muted text-center">{{ book.year}}</h6>
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
 ```
 ```vue
// resources/js/components/BookShow.vue

<template>
   <div class="container">
       <div>
            <h2 class="card-subtitle mb-2 text-muted">{{ book.title}}</h2>
            <h6 class="card-subtitle mb-2 text-muted">year: {{ book.year}}</h6>
            <h6 class="card-subtitle mb-2 text-muted">written by: {{ book.author}}</h6>
            <h6 class="card-subtitle mb-2 text-muted">published by: {{ book.publisher}}</h6>
            <h6 class="card-subtitle mb-2 text-muted">genre: {{ book.genre}}</h6>
       </div>
       <div class="row">
           <div class="col-12 border">
               <div class="card" style="width: 100%;  margin: 10px; padding: 10px;" v-for="page in 10" :key="page">
                   <div class="card-body">
                           Lorem ipsum dolor sit amet, consectetur adipiscing elit. In varius facilisis dolor,
                           at porttitor nunc luctus sit amet. In tincidunt orci id mi finibus dapibus. Proin tempus,
                           lorem eu dapibus luctus, elit ante facilisis nulla, ac tristique augue justo eu turpis.
                           Donec eu enim a sem malesuada vulputate. In at placerat ex. Nullam tincidunt dolor et magna condimentum,
                            eu pulvinar lorem dictum. Phasellus venenatis rutrum imperdiet. Aenean eu massa lobortis, condimentum nunc sed,
                            molestie sem. Integer a interdum libero. Suspendisse mollis vehicula ligula a feugiat. Curabitur non odio sit amet mi
                            condimentum iaculis. Fusce sed tincidunt sem. Aenean porta viverra neque tristique ultricies.
                   </div>
               </div>
           </div>
       </div>
   </div>
</template>

<script lang='ts'>
import useBooks from '../../composables/books';
import { onMounted } from 'vue';

export default {
   props: {
       id: {
           required: true,
           type: String
       }
   },

   setup(props: any) {
       const { book, getBook } = useBooks()

       onMounted(() => getBook(props.id))

       return {
           book
       }
   }
}
</script>   

 ```
rerun mix and test your application


## Add vue component tests 
We will need the following set upto get our tests running. 
1. Jest
2. Vue-jest and babel-jest
3. ts-jest 
4. vue-test-utils@3

install jest and add test cmd

```bash
npm install jest --save-dev
```


```js
// jest.config.js

module.exports = {
  testRegex: 'resources/assets/js/test/.*.spec.js$'
}```

```js
// package.json

scripts : {
    ...
    "test": "jest"
}```

Add vue-jest and babel-jest:
v-j: @vue/vue3-jest for jest 27 and vuejs3
```bash
npm install --save-dev @vue/vue3-jest babel-jest
```
v-j-test-utils-3:

```bash
npm install --save-dev @vue/test-utils@next
``` 

ts-jest and @types\jest:

```bash
npm install --save-dev ts-jest
npm install --save-dev @types/jest
``` 

update jest config

```js
// jest.config.js

module.exports = {
    "testEnvironment": "jsdom",
    testRegex: 'resources/js/tests/.*.spec.ts$',
    moduleFileExtensions: [
      'js',
      'json',
      'vue',
      'ts'
    ],
    'transform': {
      '^.+\\.js$': '<rootDir>/node_modules/babel-jest',
      '.*\\.(vue)$': '@vue/vue3-jest',
      "^.+\\.tsx?$": "ts-jest"
    },
  }
```

Now write your component tests
```ts 
//resources/js/tests/components/books/BookIndex.spec.ts

import { mount, shallowMount, flushPromises } from "@vue/test-utils";
import BookIndex from "../../../components/books/BookIndex.vue";
import router from "../../../router";
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

const fakeBooks = [{ "id": "1", "title": "book1", "subtitle": "hello1", "year": 1938}, { "id": "1", "title": "book1", "subtitle": "hello1", "year": 1938}, { "id": "1", "title": "book1", "subtitle": "hello1", "year": 1938}];
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

```

```ts 
//resources/js/tests/components/books/BookShow.spec.ts

import { mount, shallowMount, flushPromises } from "@vue/test-utils";
import BookShow from "../../../components/books/BookShow.vue";
import router from "../../../router";
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

const testId = '3';
const fakeBook = { "id": "3", "title": "book1", "subtitle": "hello1", "year": 1938}
const fakeData = Promise.resolve({"data": fakeBook});


describe("BookShow.vue", () => {

    beforeEach(() => {
    })

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

});

```

this is all you needed for our application, f corse you can write more tests.

```bash
npm run test
```


## 2. Let's extend our app to support full CRUD ( TDD style ) 

### create component BookCreate 

```vue
// resources/js/components/books/BookCreate.vue

<template>
    <div class="container">
        <form @submit.prevent="saveBook">
            <div class="form-group">
                <label>Title: </label>
                <input type="text" class="form-control" placeholder="book title" v-model="form.title">
            </div>
            <div class="form-group">
                <label>Year: </label>
                <input type="text" class="form-control" placeholder="book year" v-model="form.year">
            </div>
            <div class="form-group">
                <label>Author: </label>
                <select class="form-control" v-model="form.author">
                <option v-for="author in authors" :key="author">{{ author }}</option>
                </select>
            </div>
            <div class="form-group">
                <label>Publisher: </label>
                <select class="form-control" v-model="form.publisher">
                <option v-for="publisher in publishers" :key="publisher">{{ publisher }}</option>
                </select>
            </div>
            <div class="form-group">
                <label>Genre: </label>
                <select class="form-control"  v-model="form.genre">
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
```

Let's create a button to take us to this new component
add this to your BookIndex.vue
```vue
<template>
    <div class="container">
        <div class="row">
+            <router-link :to="{ name: 'books.create' }" class="text-sm font-medium nav-link">
+                <button type="button" class="btn btn-primary">Add book</button>
+            </router-link>
        </div>
        <div class="card" style="width: 18rem; float: left; margin: 5px" v-for="book in books" :key="book.id">
        .....
```

Let's add thsi to our routes so that we can access it in our app. 

```ts
// resources/js/router/index.ts

//...
,
    {
        path: '/books/create',
        name: 'books.create',
        component: BookCreate,
    },

//...
```

let's now add our create axios call in our composable books.ts and use vue-router to redirect our app to index page on success.
read comments for explanations of changes 
```ts
// resources/js/composables/books.ts

import { ref } from 'vue';
import axios from "axios";
import { useRouter } from 'vue-router'; // import vue router

export default function useBooks() {
    const books = ref([])
    const book = ref([])
    const errors = ref('') // stores errors coming from our call so that we can display 
    const router = useRouter(); // instatiante vue-router

    const authors = [ 'Terry A', 'Steven Price', 'John Smith', 'John Kennedy','Bryan Promise', 'Kyle David']; // fake authors options to select from when creating book
    const publishers = [ 'Publisher A', 'Publisher B', 'Publisher C', 'Publisher D']; // fake publishers options to select from when creating book
    const genres = ['Fiction', 'Non-Fiction', 'Business', 'Horror','Other']; // fake genres options to select from when creating book

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
            await router.push({name: 'books.index'}) // redirect app to index page on success 
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

```

Now let's write our component test, you will have noticed our component has a submittable check that checks that all values are filled. 
it is implemented as a computed property - yes! instead of an old block spcifying computed props, we can now just do it like so.
```vue

import { ..., computed } from 'vue';
...
const submittable = computed(() => {
            return form.title !== '' && form.author !== ''
            && form.publisher !== '' && form.genre !== '' && form.year !== null;
        });
```

anyways this is a good enough feature to write at least 2 test cases - one submittable must be false, and the other vice versa.

jest test cases:
1. it allows a user to submit if all values are filled.
```js
it("allows submit when all values are set", async () => {
    // set up test component
    // fill out all the fields correctly
    //assert to be submittable
    expect(wrapper.vm.submittable).toBe(true);
  });

```

2. it disallows a user to submit if all values are not filled.
```js
it("disallows submit when all values are not set", async () => {
    // set up test component
    // fill out all the fields and leave out at least one
    //assert to NOT be submittable
    expect(wrapper.vm.submittable).toBe(false);
  });
```

Our test

```ts
// resources/js/tests/components/books/BookCreate.spec.ts

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

```

at this point, adding  :EDIT and :DELETE functionality to this should be easy enough. but let's go ahead and complete this.
```vue
       <h6 class="card-subtitle mb-2 text-muted">published by: {{ book.publisher}}</h6>
            <h6 class="card-subtitle mb-2 text-muted">genre: {{ book.genre}}</h6>
       </div>

 +      <div>
 +           <router-link id="editBtn" :to="{ name: 'books.edit' , params: { id: `${book.id}` }}">Edit</router-link>&nbsp;
 +           <a id="deleteBtn" @click="deleteBook(book)" href="#" role="button">Delete</a>&nbsp;
 +       </div>
 

       <div class="row">
           <div class="col-12 border">
```


Lets's add our 2 api calls in our composable 
```ts
// resources/js/composables/books.ts

/** Edit book **/
const updateBook = async (id: number) => {
    errors.value = ''
    try {
        await axios.put('/api/books/' + id, book.value)
        await router.push({name: 'books.index'})
    } catch (e: any) {
        if (e.response.status === 422) {
            errors.value = e.response.data.errors
        }
    }
}

/** Delete book **/

const removeBook = async (id: number) => {
    await axios.delete('/api/books/' + id);
    await router.push({name: 'books.index'});
}

...

return {
    ...
    updateBook,
    removeBook
}

```

Update vue router to know about our new route and component
```ts
// resources/js/router/index.ts

...
import BookEdit from '../components/books/BookEdit.vue';

...
,
    {
        path: '/books/:id/edit',
        name: 'books.edit',
        component: BookEdit,
        props: true
    },
...
```


Let's add our new BookEdit component
```vue
// resources/js/components/books/BookEdit.vue

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

```

Let's add an example test for these
BookEdit vue component test
```ts
// resources/js/tests/components/books/BookEdit.spec.ts


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

```

Now for delete, since it doesn't have it's own component, let's test that we see the delete dialog when we hit delete with the correct book title
Let's append a test case in the BookShow.spec.ts 
```ts
// resources/js/tests/components/books/BookShow.spec.ts

...
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

...

```

I think this is good enough as a starter, you can assess your test coverage with jest adding the following in your jest config file. 

```js
...
collectCoverage: true,
    "collectCoverageFrom": [
        "resources/js/**/*.{js,jsx}",
        "resources/js/**/*.{ts,tsx}",
        "resources/js/**/*.vue",
        "!resources/js/tests/**/*.*",
        "!**/node_modules/**",
        "!**/vendor/**"
      ],
      ...
```

and run ```bash npm run test ``` again


## License
[MIT](https://choosealicense.com/licenses/mit/)
