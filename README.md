## Project set up example with Laravel 8 | Vuejs 3 Composable Api | typescript + vue jest tests starter

##### We will build a simple online book store to the help cover the following stack, these are well documented on their own but together not so much.
1. Laravel 8<br />
2. Vue-3 ( with composition api)<br />
3. Typescript for all our front end syntax<br />
4. Front end tests on using jest and Vue-test-utils <br />

#### * all set up laravel mix<br /><br />

Option A - [Set up complete project](#completeproject-set-up)<br>
Option B - [ Go through mini tutorial ( sections skippable )](#tutorial)


## Complete project set up

To set up the complete version of this project


```bash
git clone git@github.com:LufunoMaphwanya/laravel-8-vuejs-3-typescript-with-jests-online-bookstore.git laravel-online-books
cd laravel-online-books
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

download project dependencies packages and run laravel mix
```bash
composer install
php artisan migrate
```

install front end dependencies and run mix
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

# B. Tutorial 
## Our example app

A simple books store where i can log in and see available books and leave reviews. ( I've ommitted roles so we will not have admin adding new books for example).
Er diagram:

<img src="https://github.com/LufunoMaphwanya/laravel-8-vuejs-3-typescript-with-jests-online-bookstore/blob/main/github/er.png?raw=true" width='500'><br>

## Creating a Laravel online bookstore 
### Backend 
1. - [Set up laravel project](#completeproject-set-up)<br>
2. - [Models ](#completeproject-set-up)<br>
3. - [Model relationships ](#completeproject-set-up)<br>
3. - [Controllers and routes ](#completeproject-set-up)<br>
4. - [Very optional - Seed database ](#completeproject-set-up)<br>

### Frontend 
4. - [Set up complete project](#completeproject-set-up)<br>
5. - [Set up complete project](#completeproject-set-up)<br><br>

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


## Front end 
### 

## 1. Set up our vuejs3 front end 

make sure you are on node v12 -- recommended
```bash
nvm use v12
```

Install 
vuejs3, 
vuejs3-loader, 
vue-router@next and 
typescript

```bash
npm install --save vue@next vue-router@next vue-loader@next
npm install typescript ts-loader --save-dev
```

Configure our typescript
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
create tsconfig.json
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
 
let's create our components and our composable module
create composables/books.ts
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

let's create our components 
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
</script>x
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
 
 and update our laravel routeer
 ```php
// routes/web.php

// .. 

 Route::view('/{any}', 'home')
    ->middleware(['auth'])
    ->where('any', '.*');
```

let's mount our app  
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

in our home.blade file lets include our router iew tag

```blade
// resources/views/home.blade.php

...
<div>
    <router-view />
</div>
...

```

rerun mix
seerver your app and enjoy



## 2. Set up front end tests 
1. Jest
2. Vue-jest and babel-jest
3. ts-jest 

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

Create



Delete





Edit




## License
[MIT](https://choosealicense.com/licenses/mit/)
