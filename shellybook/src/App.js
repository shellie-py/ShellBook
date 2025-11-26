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
import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [currentSection, setCurrentSection] = useState('library');
  const [notes, setNotes] = useState([]);
  const [books, setBooks] = useState([
    {
      id: 1,
      title: "Евгений Онегин",
      author: "А. С. Пушкин",
      year: 1831,
      description: "Роман в стихах Александра Сергеевича Пушкина, одно из самых значительных произведений русской литературы.",
      collection: 'read' // 'favorites', 'planned', 'read'
    },
    {
      id: 2,
      title: "Преступление и наказание",
      author: "Ф. М. Достоевский",
      year: 1866,
      description: "Социально-психологический и социально-философский роман Фёдора Михайловича Достоевского.",
      collection: 'favorites'
    },
    {
      id: 3,
      title: "Война и мир",
      author: "Л. Н. Толстой",
      year: 1869,
      description: "Роман-эпопея Льва Николаевича Толстого, описывающий русское общество в эпоху войн против Наполеона.",
      collection: 'planned'
    },
    {
      id: 4,
      title: "Мёртвые души",
      author: "Н. В. Гоголь",
      year: 1842,
      description: "Поэма Николая Васильевича Гоголя, жанр которой сам автор обозначил как поэма.",
      collection: null
    },
    {
      id: 5,
      title: "Отцы и дети",
      author: "И. С. Тургенев",
      year: 1862,
      description: "Роман Ивана Сергеевича Тургенева, знаменитый социально-психологический конфликт.",
      collection: null
    }
  ]);

  // Загружаем данные из localStorage
  useEffect(() => {
    const savedNotes = localStorage.getItem('shellbook-notes');
    const savedBooks = localStorage.getItem('shellbook-books');
    
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes));
    }
    if (savedBooks) {
      setBooks(JSON.parse(savedBooks));
    }
  }, []);

  // Сохраняем данные в localStorage
  useEffect(() => {
    localStorage.setItem('shellbook-notes', JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem('shellbook-books', JSON.stringify(books));
  }, [books]);

  // Функция для добавления новой заметки
  const addNote = (newNote) => {
    const noteWithId = {
      ...newNote,
      id: Date.now(),
      createdAt: new Date().toISOString()
    };
    setNotes([...notes, noteWithId]);
  };

  // Функция для удаления заметки
  const deleteNote = (noteId) => {
    setNotes(notes.filter(note => note.id !== noteId));
  };

  // Функция для добавления книги в коллекцию
  const addToCollection = (bookId, collection) => {
    setBooks(books.map(book => 
      book.id === bookId ? { ...book, collection } : book
    ));
  };

  // Функция для удаления книги из коллекции
  const removeFromCollection = (bookId) => {
    setBooks(books.map(book => 
      book.id === bookId ? { ...book, collection: null } : book
    ));
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
        {currentSection === 'library' && (
          <LibrarySection 
            books={books} 
            onAddNote={addNote} 
            onAddToCollection={addToCollection}
            onRemoveFromCollection={removeFromCollection}
          />
        )}
        {currentSection === 'notes' && (
          <NotesSection 
            notes={notes} 
            onDeleteNote={deleteNote} 
            books={books} 
          />
        )}
        {currentSection === 'collections' && (
          <CollectionsSection 
            books={books}
            onAddToCollection={addToCollection}
            onRemoveFromCollection={removeFromCollection}
          />
        )}
      </main>
    </div>
  );
}

function LibrarySection({ books, onAddNote, onAddToCollection, onRemoveFromCollection }) {
  const [selectedBook, setSelectedBook] = useState(null);
  const [noteText, setNoteText] = useState('');

  const handleAddNote = (book) => {
    if (noteText.trim()) {
      onAddNote({
        bookId: book.id,
        bookTitle: book.title,
        text: noteText,
        page: '',
        quote: ''
      });
      setNoteText('');
      setSelectedBook(null);
      alert('Заметка добавлена!');
    }
  };

  const getCollectionIcon = (collection) => {
    switch(collection) {
      case 'favorites': return '⭐';
      case 'planned': return '📚';
      case 'read': return '✅';
      default: return '📖';
    }
  };

  if (selectedBook) {
    return (
      <div>
        <button onClick={() => setSelectedBook(null)} className="back-button">
          ← Назад к библиотеке
        </button>
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
            <div className="book-header" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px'}}>
              <div className="book-title">{book.title}</div>
              <span style={{fontSize: '1.2rem'}}>{getCollectionIcon(book.collection)}</span>
            </div>
            <div className="book-author">{book.author}, {book.year}</div>
            <div className="book-description">{book.description}</div>
            
            <div className="collection-buttons" style={{marginTop: '15px', display: 'flex', flexDirection: 'column', gap: '8px'}}>
              <button 
                className="add-note-btn"
                onClick={() => setSelectedBook(book)}
              >
                Добавить заметку
              </button>
              
              <div style={{display: 'flex', gap: '5px', flexWrap: 'wrap'}}>
                <button 
                  onClick={() => onAddToCollection(book.id, 'favorites')}
                  style={{
                    padding: '5px 10px',
                    background: book.collection === 'favorites' ? '#ffb37b' : 'transparent',
                    border: '1px solid #ffb37b',
                    borderRadius: '15px',
                    fontSize: '0.8rem',
                    color: book.collection === 'favorites' ? 'white' : '#ffb37b',
                    cursor: 'pointer'
                  }}
                >
                  ⭐
                </button>
                <button 
                  onClick={() => onAddToCollection(book.id, 'planned')}
                  style={{
                    padding: '5px 10px',
                    background: book.collection === 'planned' ? '#7bc1a3' : 'transparent',
                    border: '1px solid #7bc1a3',
                    borderRadius: '15px',
                    fontSize: '0.8rem',
                    color: book.collection === 'planned' ? 'white' : '#7bc1a3',
                    cursor: 'pointer'
                  }}
                >
                  📚
                </button>
                <button 
                  onClick={() => onAddToCollection(book.id, 'read')}
                  style={{
                    padding: '5px 10px',
                    background: book.collection === 'read' ? '#b8aed8' : 'transparent',
                    border: '1px solid #b8aed8',
                    borderRadius: '15px',
                    fontSize: '0.8rem',
                    color: book.collection === 'read' ? 'white' : '#b8aed8',
                    cursor: 'pointer'
                  }}
                >
                  ✅
                </button>
                {book.collection && (
                  <button 
                    onClick={() => onRemoveFromCollection(book.id)}
                    style={{
                      padding: '5px 10px',
                      background: 'transparent',
                      border: '1px solid #e8a8a8',
                      borderRadius: '15px',
                      fontSize: '0.8rem',
                      color: '#d67f7f',
                      cursor: 'pointer'
                    }}
                  >
                    🗑️
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

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

function CollectionsSection({ books, onAddToCollection, onRemoveFromCollection }) {
  const favorites = books.filter(book => book.collection === 'favorites');
  const planned = books.filter(book => book.collection === 'planned');
  const read = books.filter(book => book.collection === 'read');

  const CollectionCard = ({ title, description, books, icon, type }) => (
    <div className={`collection-card ${type}`}>
      <h3>{icon} {title}</h3>
      <p>{description}</p>
      <div style={{marginTop: '15px', fontSize: '0.9rem'}}>
        Книг в коллекции: <strong>{books.length}</strong>
      </div>
    </div>
  );

  const BookInCollection = ({ book, onRemove }) => (
    <div className="book-card" style={{marginBottom: '10px'}}>
      <div className="book-title">{book.title}</div>
      <div className="book-author">{book.author}, {book.year}</div>
      <button 
        onClick={() => onRemove(book.id)}
        className="delete-note-btn"
        style={{marginTop: '10px', fontSize: '0.8rem'}}
      >
        Удалить из коллекции
      </button>
    </div>
  );

  return (
    <div>
      <h2>Мои коллекции</h2>
      
      <div className="collections-grid">
        <CollectionCard 
          title="Избранное" 
          description="Самые понравившиеся книги"
          books={favorites}
          icon="⭐"
          type="favorites"
        />
        <CollectionCard 
          title="В планах" 
          description="Книги для будущего прочтения"
          books={planned}
          icon="📚"
          type="planned"
        />
        <CollectionCard 
          title="Прочитано" 
          description="Завершенные книги"
          books={read}
          icon="✅"
          type="read"
        />
      </div>

      <div style={{marginTop: '40px'}}>
        <h3>Книги в коллекциях</h3>
        
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', marginTop: '20px'}}>
          <div>
            <h4 style={{color: '#ffb37b', marginBottom: '15px'}}>⭐ Избранное ({favorites.length})</h4>
            {favorites.length === 0 ? (
              <p style={{color: '#9e9bb6', fontStyle: 'italic'}}>Пока нет книг в избранном</p>
            ) : (
              favorites.map(book => (
                <BookInCollection 
                  key={book.id} 
                  book={book} 
                  onRemove={onRemoveFromCollection}
                />
              ))
            )}
          </div>
          
          <div>
            <h4 style={{color: '#7bc1a3', marginBottom: '15px'}}>📚 В планах ({planned.length})</h4>
            {planned.length === 0 ? (
              <p style={{color: '#9e9bb6', fontStyle: 'italic'}}>Пока нет книг в планах</p>
            ) : (
              planned.map(book => (
                <BookInCollection 
                  key={book.id} 
                  book={book} 
                  onRemove={onRemoveFromCollection}
                />
              ))
            )}
          </div>
          
          <div>
            <h4 style={{color: '#b8aed8', marginBottom: '15px'}}>✅ Прочитано ({read.length})</h4>
            {read.length === 0 ? (
              <p style={{color: '#9e9bb6', fontStyle: 'italic'}}>Пока нет прочитанных книг</p>
            ) : (
              read.map(book => (
                <BookInCollection 
                  key={book.id} 
                  book={book} 
                  onRemove={onRemoveFromCollection}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}



export default App;