# Booklist Capstone Project

## Features

Lists a personal book list of mine stored in an SQL database.

A database consists of:

- **a. booklist**

  1.  id (**SERIAL PRIMARY KEY**)
  2.  title (**TEXT NOT NULL**)
  3.  author (**TEXT NOT NULL**)
  4.  rating (**REAL CHECK (rating >= 0 AND rating <= 5)**)
  5.  updated_at (**TIMESTAMP NOT NULL DEFUALT NOW()**)
  6.  review (**TEXT**)

- **b. bookcover**
  1.  id (**SERIAL PRIMARY KEY**)
  2.  book_id (**INT REFERENCES booklist(id)**)
  3.  isbn (**VARCHAR(13) UNIQUE NOT NULL CHECK (isbn SIMILAR TO '[0-9]{10}|[0-9]{13}')**)

Covers are taken with the [Open Library API](https://openlibrary.org/developers/api).

When opening a review, the primary color of the cover image is taken with the help of [Colorthief](https://github.com/lokesh/color-thief), and the background becomes a gradient based on it.

Note:
All the reviews themselves are AI-generated as this is just an exercise project and I dont' want to take it too seriously. Additionally, the code isn't the most optimized as it makes a bunch of API requests and it takes time for the program to dowload the buffer of the images. I can make it better and more sustainable, but I really wanna move on.
