import React, { useState, useEffect } from 'react';
import './App.css';

// Импортируем тексты книг
import shinelText from './books/gogol_shinel.txt';
import damaText from './books/chekhov_dama.txt';
import prestuplenieText from './books/dostoevsky_prestuplenie.txt';
import kavkazskyText from './books/tolstoy_kavkazsky_plennik.txt';

function App() {
  const [currentSection, setCurrentSection] = useState('library');
  const [notes, setNotes] = useState([]);
  const [books, setBooks] = useState([
    {
      id: 1,
      title: "Шинель",
      author: "Николай Гоголь",
      year: 1842,
      description: "Одна из самых известных повестей Гоголя о мелком чиновнике Акакии Акакиевиче Башмачкине.",
      collection: 'read',
      text: shinelText,
      canRead: true
    },
    {
      id: 2,
      title: "Преступление и наказание",
      author: "Фёдор Достоевский",
      year: 1866,
      description: "Социально-психологический роман о бывшем студенте Родионе Раскольникове.",
      collection: 'favorites',
      text: prestuplenieText,
      canRead: true
    },
    {
      id: 3,
      title: "Дама с собачкой",
      author: "Антон Чехов",
      year: 1899,
      description: "Рассказ о любовной связи между мужчиной и женщиной, которые оба состоят в браке.",
      collection: 'planned',
      text: damaText,
      canRead: true
    },
    {
      id: 4,
      title: "Кавказский пленник",
      author: "Лев Толстой",
      year: 1872,
      description: "Рассказ о русском офицере Жилине, попавшем в плен к горцам во время Кавказской войны.",
      text: kavkazskyText,
      canRead: true,
      collection: null
    },
    {
      id: 5,
      title: "Портрет Дориана Грея",
      author: "Оскар Уайльд",
      year: 1890,
      description: "Роман о красивом молодом человеке, который желает, чтобы его портрет старел вместо него.",
      collection: null,
      canRead: false,
      externalLink: "https://www.culture.ru/read/portret-doriana-greya"
    },
    {
      id: 6,
      title: "1984",
      author: "Джордж Оруэлл",
      year: 1949,
      description: "Антиутопический роман о тоталитарном обществе под постоянным контролем Большого Брата.",
      collection: 'planned',
      canRead: false,
      externalLink: "https://www.litres.ru/book/dzhordzh-oruell/1984-535330/"
    },
    {
      id: 7,
      title: "Заводной апельсин",
      author: "Энтони Бёрджесс",
      year: 1962,
      description: "Роман о подростке-преступнике в антиутопическом будущем Великобритании.",
      collection: null,
      canRead: false,
      externalLink: "https://www.litres.ru/book/entoni-berdzhess/mehanicheskiy-apelsin-114199/"
    },
    {
      id: 8,
      title: "Мёртвые души",
      author: "Николай Гоголь",
      year: 1842,
      description: "Поэма о афере Чичикова, скупающего «мёртвые души» у помещиков.",
      collection: null,
      canRead: false,
      externalLink: "https://ilibrary.ru/text/1090/index.html"
    }
  ]);

  const [selectedBook, setSelectedBook] = useState(null);
  const [bookText, setBookText] = useState('');

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

  // Загружаем текст книги при выборе
  useEffect(() => {
    if (selectedBook && selectedBook.canRead && selectedBook.text) {
      fetch(selectedBook.text)
        .then(response => response.text())
        .then(text => setBookText(text))
        .catch(error => console.error('Ошибка загрузки книги:', error));
    }
  }, [selectedBook]);

  // Функция для добавления новой заметки
  const addNote = (newNote) => {
    const noteWithId = {
      ...newNote,
      id: Date.now(),
      createdAt: new Date().toISOString(),
      lastEdited: new Date().toISOString()
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

  // Функция для чтения книги
  const handleReadBook = (book) => {
    setSelectedBook(book);
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
        {selectedBook ? (
          <BookReader 
            book={selectedBook} 
            bookText={bookText}
            onBack={() => setSelectedBook(null)}
            onAddNote={addNote}
          />
        ) : (
          <>
            {currentSection === 'library' && (
              <LibrarySection 
                books={books} 
                onAddNote={addNote} 
                onAddToCollection={addToCollection}
                onRemoveFromCollection={removeFromCollection}
                onReadBook={handleReadBook}
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
                onReadBook={handleReadBook}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
}

// Компонент чтения книги
function BookReader({ book, bookText, onBack, onAddNote }) {
  const [noteText, setNoteText] = useState('');
  const [showNoteForm, setShowNoteForm] = useState(false);

  const handleAddNote = () => {
    if (noteText.trim()) {
      onAddNote({
        bookId: book.id,
        bookTitle: book.title,
        text: noteText,
        page: 'начало',
        quote: bookText.substring(0, 100) + '...'
      });
      setNoteText('');
      setShowNoteForm(false);
      alert('Заметка добавлена!');
    }
  };

  if (!book.canRead) {
    return (
      <div>
        <button onClick={onBack} className="back-button">← Назад к библиотеке</button>
        <div className="book-info">
          <h2>{book.title}</h2>
          <div className="book-author">{book.author}, {book.year}</div>
          <p className="book-description">{book.description}</p>
          <div className="external-link-info">
            <p>📚 Эта книга защищена авторским правом, но вы можете прочитать её легально:</p>
            <a href={book.externalLink} target="_blank" rel="noopener noreferrer" className="external-link">
              Читать на внешнем ресурсе →
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="book-reader">
      <div className="reader-header">
        <button onClick={onBack} className="back-button">← Назад к библиотеке</button>
        <div className="reader-book-info">
          <h2>{book.title}</h2>
          <div className="book-author">{book.author}, {book.year}</div>
        </div>
        <button 
          onClick={() => setShowNoteForm(!showNoteForm)}
          className="add-note-btn"
        >
          {showNoteForm ? 'Отменить' : 'Добавить заметку'}
        </button>
      </div>

      {showNoteForm && (
        <div className="note-form">
          <textarea
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            placeholder="Запишите ваши мысли о прочитанном..."
            className="note-textarea"
            rows="4"
          />
          <button 
            onClick={handleAddNote}
            className="save-note-btn"
            disabled={!noteText.trim()}
          >
            Сохранить заметку
          </button>
        </div>
      )}

      <div className="book-text">
        {bookText ? (
          <pre>{bookText}</pre>
        ) : (
          <div className="loading">Загрузка книги...</div>
        )}
      </div>
    </div>
  );
}

// Компонент библиотеки
function LibrarySection({ books, onAddNote, onAddToCollection, onRemoveFromCollection, onReadBook }) {
  const [selectedBookForNote, setSelectedBookForNote] = useState(null);
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
      setSelectedBookForNote(null);
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

  if (selectedBookForNote) {
    return (
      <div>
        <button onClick={() => setSelectedBookForNote(null)} className="back-button">
          ← Назад к библиотеке
        </button>
        <h2>Добавить заметку для "{selectedBookForNote.title}"</h2>
        <div className="book-card">
          <div className="book-title">{selectedBookForNote.title}</div>
          <div className="book-author">{selectedBookForNote.author}, {selectedBookForNote.year}</div>
        </div>
        <textarea
          value={noteText}
          onChange={(e) => setNoteText(e.target.value)}
          placeholder="Начните ввод ваших мыслей о книге..."
          className="note-textarea"
          rows="6"
        />
        <button 
          onClick={() => handleAddNote(selectedBookForNote)}
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
            
            <div className="book-actions" style={{marginTop: '15px', display: 'flex', flexDirection: 'column', gap: '8px'}}>
              {book.canRead ? (
                <button 
                  className="read-book-btn"
                  onClick={() => onReadBook(book)}
                >
                  📖 Читать
                </button>
              ) : (
                <a 
                  href={book.externalLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="external-link-btn"
                >
                  🔗 Читать онлайн
                </a>
              )}
              
              <button 
                className="add-note-btn"
                onClick={() => setSelectedBookForNote(book)}
              >
                ✏️ Добавить заметку
              </button>
              
              <div style={{display: 'flex', gap: '5px', flexWrap: 'wrap', justifyContent: 'center'}}>
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

// Компонент заметок с улучшенным отображением дат
function NotesSection({ notes, onDeleteNote, books }) {
  const [filterBook, setFilterBook] = useState('all');

  const filteredNotes = filterBook === 'all' 
    ? notes 
    : notes.filter(note => note.bookId === parseInt(filterBook));

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return `Сегодня в ${date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}`;
    } else if (diffDays === 1) {
      return `Вчера в ${date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}`;
    } else if (diffDays < 7) {
      return `${diffDays} дней назад`;
    } else {
      return date.toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'только что';
    if (diffMins < 60) return `${diffMins} мин. назад`;
    if (diffHours < 24) return `${diffHours} ч. назад`;
    if (diffDays === 1) return 'вчера';
    if (diffDays < 7) return `${diffDays} дн. назад`;
    return formatDate(dateString);
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
        <div style={{marginLeft: 'auto', color: '#7a6ba8', fontSize: '0.9rem'}}>
          Всего заметок: <strong>{filteredNotes.length}</strong>
        </div>
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
                <div className="note-date-info">
                  <div className="note-date">{formatDate(note.createdAt)}</div>
                  <div className="note-time-ago">{getTimeAgo(note.createdAt)}</div>
                </div>
              </div>
              <div className="note-text">{note.text}</div>
              {note.quote && (
                <div className="note-quote">
                  <strong>Цитата:</strong> {note.quote}
                </div>
              )}
              <button 
                onClick={() => onDeleteNote(note.id)}
                className="delete-note-btn"
              >
                Удалить
              </button>
            </div>
          )).reverse() // Новые заметки сверху
        )}
      </div>
    </div>
  );
}

// Компонент коллекций
function CollectionsSection({ books, onAddToCollection, onRemoveFromCollection, onReadBook }) {
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

  const BookInCollection = ({ book, onRemove, onRead }) => (
    <div className="book-card" style={{marginBottom: '10px'}}>
      <div className="book-title">{book.title}</div>
      <div className="book-author">{book.author}, {book.year}</div>
      <div className="book-actions" style={{marginTop: '10px', display: 'flex', gap: '8px', flexWrap: 'wrap'}}>
        {book.canRead ? (
          <button 
            onClick={() => onRead(book)}
            className="read-book-btn"
            style={{fontSize: '0.8rem', padding: '5px 10px'}}
          >
            📖 Читать
          </button>
        ) : (
          <a 
            href={book.externalLink} 
            target="_blank" 
            rel="noopener noreferrer"
            className="external-link-btn"
            style={{fontSize: '0.8rem', padding: '5px 10px'}}
          >
            🔗 Читать
          </a>
        )}
        <button 
          onClick={() => onRemove(book.id)}
          className="delete-note-btn"
          style={{fontSize: '0.8rem', padding: '5px 10px'}}
        >
          Удалить
        </button>
      </div>
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
                  onRead={onReadBook}
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
                  onRead={onReadBook}
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
                  onRead={onReadBook}
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