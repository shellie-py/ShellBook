import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [currentSection, setCurrentSection] = useState('library');
  const [notes, setNotes] = useState([]);
  const [books] = useState([
    {
      id: 1,
      title: "Евгений Онегин",
      author: "А. С. Пушкин",
      year: 1831,
      description: "Роман в стихах Александра Сергеевича Пушкина, одно из самых значительных произведений русской литературы."
    },
    {
      id: 2,
      title: "Преступление и наказание",
      author: "Ф. М. Достоевский",
      year: 1866,
      description: "Социально-психологический и социально-философский роман Фёдора Михайловича Достоевского."
    },
    {
      id: 3,
      title: "Война и мир",
      author: "Л. Н. Толстой",
      year: 1869,
      description: "Роман-эпопея Льва Николаевича Толстого, описывающий русское общество в эпоху войн против Наполеона."
    }
  ]);

  // Загружаем заметки из localStorage при загрузке приложения
  useEffect(() => {
    const savedNotes = localStorage.getItem('shellbook-notes');
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes));
    }
  }, []);

  // Сохраняем заметки в localStorage при их изменении
  useEffect(() => {
    localStorage.setItem('shellbook-notes', JSON.stringify(notes));
  }, [notes]);

  // Функция для добавления новой заметки
  const addNote = (newNote) => {
    const noteWithId = {
      ...newNote,
      id: Date.now(), // Простой способ получить уникальный ID
      createdAt: new Date().toISOString()
    };
    setNotes([...notes, noteWithId]);
  };

  // Функция для удаления заметки
  const deleteNote = (noteId) => {
    setNotes(notes.filter(note => note.id !== noteId));
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Shell Book</h1>
      </header>
      
      <nav className="navigation">
        <button 
          className={currentSection === 'library' ? 'active' : ''}
          onClick={() => setCurrentSection('library')}
        >
          Библиотека
        </button>
        <button 
          className={currentSection === 'notes' ? 'active' : ''}
          onClick={() => setCurrentSection('notes')}
        >
          Заметки
        </button>
        <button 
          className={currentSection === 'collections' ? 'active' : ''}
          onClick={() => setCurrentSection('collections')}
        >
          Коллекции
        </button>
      </nav>

      <main className="main-content">
        {currentSection === 'library' && <LibrarySection books={books} onAddNote={addNote} />}
        {currentSection === 'notes' && <NotesSection notes={notes} onDeleteNote={deleteNote} books={books} />}
        {currentSection === 'collections' && <CollectionsSection />}
      </main>
    </div>
  );
}

// Компонент библиотеки
function LibrarySection({ books, onAddNote }) {
  const [selectedBook, setSelectedBook] = useState(null);
  const [noteText, setNoteText] = useState('');

  const handleAddNote = (book) => {
    if (noteText.trim()) {
      onAddNote({
        bookId: book.id,
        bookTitle: book.title,
        text: noteText,
        page: '', // Можно добавить поле для страницы
        quote: '' // Можно добавить поле для цитаты
      });
      setNoteText('');
      setSelectedBook(null);
      alert('Заметка добавлена!');
    }
  };

  if (selectedBook) {
    return (
      <div>
        <button onClick={() => setSelectedBook(null)} className="back-button">← Назад к библиотеке</button>
        <h2>Добавить заметку для "{selectedBook.title}"</h2>
        <div className="book-card">
          <div className="book-title">{selectedBook.title}</div>
          <div className="book-author">{selectedBook.author}, {selectedBook.year}</div>
        </div>
        <textarea
          value={noteText}
          onChange={(e) => setNoteText(e.target.value)}
          placeholder="Начните ввод ваших мыслей о книге..."
          className="note-textarea"
          rows="6"
        />
        <button 
          onClick={() => handleAddNote(selectedBook)}
          className="save-note-btn"
          disabled={!noteText.trim()}
        >
          Сохранить заметку
        </button>
      </div>
    );
  }

  return (
    <div>
      <h2>Библиотека</h2>
      <div className="books-grid">
        {books.map(book => (
          <div key={book.id} className="book-card">
            <div className="book-title">{book.title}</div>
            <div className="book-author">{book.author}, {book.year}</div>
            <div className="book-description">{book.description}</div>
            <button 
              className="add-note-btn"
              onClick={() => setSelectedBook(book)}
            >
              Добавить заметку
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// Компонент заметок
function NotesSection({ notes, onDeleteNote, books }) {
  const [filterBook, setFilterBook] = useState('all');

  const filteredNotes = filterBook === 'all' 
    ? notes 
    : notes.filter(note => note.bookId === parseInt(filterBook));

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div>
      <h2>Мои заметки</h2>
      
      <div className="notes-filter">
        <label>Фильтр по книгам: </label>
        <select value={filterBook} onChange={(e) => setFilterBook(e.target.value)}>
          <option value="all">Все книги</option>
          {books.map(book => (
            <option key={book.id} value={book.id}>{book.title}</option>
          ))}
        </select>
      </div>

      <div className="notes-list">
        {filteredNotes.length === 0 ? (
          <div className="no-notes">
            <p>У вас пока нет заметок. Добавьте первую заметку из раздела "Библиотека"!</p>
          </div>
        ) : (
          filteredNotes.map(note => (
            <div key={note.id} className="note-card">
              <div className="note-header">
                <div className="note-book-title">{note.bookTitle}</div>
                <div className="note-date">{formatDate(note.createdAt)}</div>
              </div>
              <div className="note-text">{note.text}</div>
              <button 
                onClick={() => onDeleteNote(note.id)}
                className="delete-note-btn"
              >
                Удалить
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// Компонент коллекций (пока заглушка)
function CollectionsSection() {
  return (
    <div>
      <h2>Коллекции</h2>
      <div className="collections-grid">
        <div className="collection-card">
          <h3>⭐ Избранное</h3>
          <p>Самые понравившиеся книги</p>
        </div>
        <div className="collection-card">
          <h3>📚 В планах</h3>
          <p>Книги для будущего прочтения</p>
        </div>
        <div className="collection-card">
          <h3>✅ Прочитано</h3>
          <p>Завершенные книги</p>
        </div>
      </div>
    </div>
  );
}

export default App;