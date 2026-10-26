package com.example.library;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

@RestController
@RequestMapping("/api/books")
public class BookController {
    private final List<Book> books = new CopyOnWriteArrayList<>();

    @GetMapping
    public List<Book> getBooks() {
        return new ArrayList<>(books);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Book addBook(@RequestBody Book book) {
        if (isBlank(book.getTitle()) || isBlank(book.getAuthor()) || isBlank(book.getIsbn())) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST, "Title, author, and ISBN are required."
            );
        }

        boolean duplicate = books.stream()
            .anyMatch(existing -> existing.getIsbn().equalsIgnoreCase(book.getIsbn().trim()));
        if (duplicate) {
            throw new ResponseStatusException(
                HttpStatus.CONFLICT, "A book with this ISBN already exists."
            );
        }

        book.setTitle(book.getTitle().trim());
        book.setAuthor(book.getAuthor().trim());
        book.setIsbn(book.getIsbn().trim());
        books.add(book);
        return book;
    }

    @DeleteMapping("/{isbn}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void removeBook(@PathVariable String isbn) {
        boolean removed = books.removeIf(
            book -> book.getIsbn().equalsIgnoreCase(isbn)
        );
        if (!removed) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Book not found.");
        }
    }

    private boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }
}
