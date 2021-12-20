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
