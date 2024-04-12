const express = require('express')
const router = express.Router()

const Book = require('../models/book.model.js')
const { json } = require('body-parser')

// MIDDLEWARE
const getBook = async (req, res, next) => {
  let book
  const { id } = req.params

  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(404).json({
      message: 'El ID del libro no es válido'
    })
  }

  try {
    book = await Book.findById(id)
    if (!book) {
      return res.status(404).json({
        message: 'El libro no fue encontrado'
      })
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message
    })
  }

  res.book = book
  next()
}

// get all books

router.get('/', async (req, res) => {
  try {
    const books = await Book.find()
    console.log(books)
    if (books.length === 0) {
      return res.status(204).json([])
    }
    res.json(books)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// get by id

/*router.get('/:id', getBook, async (req, res) => {
  try {
    const books = await Book.find()
    console.log(books)
    if (books.length === 0) {
      return res.status(204).json([])
    }
    res.json(books)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})*/
router.get('/:id', getBook, async (req, res) => {
  res.json(res.book)
})

// create a new book

router.post('/', async (req, res) => {
  const { title, author, genre, publicationDate } = req?.body
  if (!title || !author || !genre || !publicationDate) {
    return res.status(400).json({ message: 'The title, author, genre, publicationDate is required' })
  }

  const book = new Book({ title, author, genre, publicationDate })

  try {
    const newBook = await book.save()
    res.status(201).json(newBook)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

// update the book
router.put('/:id', getBook, async (req, res) => {
  try {
    const book = res.book
    book.title = req.body.title || book.title
    book.author = req.body.author || book.author
    book.genre = req.body.genre || book.genre
    book.publicationDate = req.body.publicationDate || book.publicationDate

    const updatedBook = await book.save()
    res.json(updatedBook)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
  res.json(res.book)
})

// patch the book

router.patch('/:id', getBook, async (req, res) => {
  if (!req.body.title && !req.body.author && !req.body.genre && !req.body.publicationDate) {
    res.status(400).json({
      message: 'Al menos uno de estos debe ser enviado: Title, author, genre, publicationDate'
    })
  }

  try {
    const book = res.book
    book.title = req.body.title || book.title
    book.author = req.body.author || book.author
    book.genre = req.body.genre || book.genre
    book.publicationDate = req.body.publicationDate || book.publicationDate

    const updatedBook = await book.save()
    res.json(updatedBook)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
  res.json(res.book)
})

// delete book

router.delete('/:id', getBook, async (req, res) => {
  try {
    const book = res.book
    await book.deleteOne({
      _id: book._id
    })

    res.json({ message: `The book ${book.title} has been deleted` })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

module.exports = router
