<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class BookSeeder extends Seeder
{
    /**
    * Seed test data books
     */
    public function run()
    {
        $authors = [
            'Terry A',
            'Steven Price',
            'John Smith',
            'John Kennedy',
            'Bryan Promise',
            'Kyle David'
            // ...
        ];

        $genres = [
            'Fiction',
            'Non-Fiction',
            'Business',
            'Horror',
            'Other'
            // ...

        ];

        $publishers = [
            'Publisher A',
            'Publisher B',
            'Publisher C',
            'Publisher D'
            // ...
        ];

        for ($x = 0; $x <= 50; $x++) {
            DB::table('books')->insert(
                [
                    'title' => "Book title {$x}",
                    'year' => rand(1995, 2021),
                    'genre' => $genres[rand(0, count($genres)-1)],
                    'author' => $authors[rand(0, count($authors)-1)],
                    'publisher' => $publishers[rand(0, count($publishers)-1)]
                ]
            );
        }
    }
}
