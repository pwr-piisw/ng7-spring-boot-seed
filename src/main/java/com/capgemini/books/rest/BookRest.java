package com.capgemini.books.rest;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(value = "/services/rest")
public class BookRest {

    private final Map<Long, Book> books = new ConcurrentHashMap<Long, Book>(
            Arrays.asList(
                    new Book(1000L, "John Example", "Super book..."),
                    new Book(1001L, "Gavin King", "Hibernate in Action"),
                    new Book(1002L, "Douglas Crockford", "JavaScript: The Good Parts"))

                    .stream()
                    .collect(Collectors.toMap(Book::getId, Function.identity())));

    private final Object seqLock = new Object();

    private long sequencer = books.values().stream()
            .max(Comparator.comparingLong(Book::getId))
            .get().getId() + 1L;

    private long getNextValue() {
        synchronized (seqLock) {
            return sequencer++;
        }
    }

    @RequestMapping(value = "/books", method = RequestMethod.GET)
    public List<Book> getBooks() {
        return books.values().stream()
                .sorted(Comparator.comparingLong(Book::getId))
                .collect(Collectors.toList());
    }

    @RequestMapping(value = "/books/{id}", method = RequestMethod.GET)
    public ResponseEntity<Book> getBook(@PathVariable("id") long id) {
        final Book found = books.get(id);
        if (found != null) {
            return ResponseEntity.ok(found);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @RequestMapping(value = "/books/{id}", method = RequestMethod.DELETE)
    public ResponseEntity<Void> deleteBook(@PathVariable("id") long id) {
        final Book deleted = books.remove(id);
        if (deleted != null) {
            return ResponseEntity.ok(null);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @RequestMapping(value = "/books", method = RequestMethod.POST)
    public ResponseEntity<Book> saveBook(@RequestBody Book book) {
        final long id = Optional.of(book.getId()).orElseGet(this::getNextValue);
        final Book newBook = new Book(id, book.getAuthor(), book.getTitle());
        books.put(id, newBook);
        return ResponseEntity.ok(newBook);
    }
}
