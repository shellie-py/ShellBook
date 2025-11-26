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
  const [bookmarks, setBookmarks] = useState([]);
  const [customCollections, setCustomCollections] = useState([]);
  const [books, setBooks] = useState([
    {
      id: 1,
      title: "Шинель",
      author: "Николай Гоголь",
      year: 1842,
      description: "Одна из самых известных повестей Гоголя о мелком чиновнике Акакии Акакиевиче Башмачкине.",
      collection: null,
      text: shinelText,
      canRead: true
    },
    {
      id: 2,
      title: "Преступление и наказание",
      author: "Фёдор Достоевский",
      year: 1866,
      description: "Социально-психологический роман о бывшем студенте Родионе Раскольникове.",
      collection: null,
      text: prestuplenieText,
      canRead: true
    },
    {
      id: 3,
      title: "Дама с собачкой",
      author: "Антон Чехов",
      year: 1899,
      description: "Рассказ о любовной связи между мужчиной и женщиной, которые оба состоят в браке.",
      collection: null,
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
      externalLink: "https://www.100bestbooks.ru/files/Wild_Portret_Doriana_Greya.pdf"    },
    {
      id: 6,
      title: "1984",
      author: "Джордж Оруэлл",
      year: 1949,
      description: "Антиутопический роман о тоталитарном обществе под постоянным контролем Большого Брата.",
      collection: null,
      canRead: false,
      externalLink: "https://boomdown.org/sites/default/files/1984_1948.pdf"    },
    {
      id: 7,
      title: "Заводной апельсин",
      author: "Энтони Бёрджесс",
      year: 1962,
      description: "Роман о подростке-преступнике в антиутопическом будущем Великобритании.",
      collection: null,
      canRead: false,
      externalLink: "https://lib.ru/INPROZ/BERDZHES/apelsin.txt_with-big-pictures.html"    },
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
    const savedBookmarks = localStorage.getItem('shellbook-bookmarks');
    const savedCollections = localStorage.getItem('shellbook-custom-collections');
    
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes));
    }
    if (savedBooks) {
      setBooks(JSON.parse(savedBooks));
    }
    if (savedBookmarks) {
      setBookmarks(JSON.parse(savedBookmarks));
    }
    if (savedCollections) {
      setCustomCollections(JSON.parse(savedCollections));
    }
  }, []);

  // Сохраняем данные в localStorage
  useEffect(() => {
    localStorage.setItem('shellbook-notes', JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem('shellbook-books', JSON.stringify(books));
  }, [books]);

  useEffect(() => {
    localStorage.setItem('shellbook-bookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  useEffect(() => {
    localStorage.setItem('shellbook-custom-collections', JSON.stringify(customCollections));
  }, [customCollections]);

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

  // Функция для добавления закладки
  const addBookmark = (bookmark) => {
    const bookmarkWithId = {
      ...bookmark,
      id: Date.now(),
      createdAt: new Date().toISOString()
    };
    setBookmarks([...bookmarks, bookmarkWithId]);
  };

  // Функция для удаления закладки
  const deleteBookmark = (bookmarkId) => {
    setBookmarks(bookmarks.filter(bookmark => bookmark.id !== bookmarkId));
  };

  // Функция для перехода к закладке
  const goToBookmark = (position) => {
    const element = document.getElementById(`text-${position}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      element.style.backgroundColor = '#fff9e6';
      setTimeout(() => {
        element.style.backgroundColor = 'transparent';
      }, 2000);
    }
  };

  // Функции для пользовательских коллекций
  const createCustomCollection = (collection) => {
    const collectionWithId = {
      ...collection,
      id: Date.now(),
      createdAt: new Date().toISOString(),
      books: []
    };
    setCustomCollections([...customCollections, collectionWithId]);
  };

  const deleteCustomCollection = (collectionId) => {
    setCustomCollections(customCollections.filter(collection => collection.id !== collectionId));
  };

  const addBookToCustomCollection = (collectionId, bookId) => {
    setCustomCollections(customCollections.map(collection => 
      collection.id === collectionId 
        ? { ...collection, books: [...collection.books, bookId] }
        : collection
    ));
  };

  const removeBookFromCustomCollection = (collectionId, bookId) => {
    setCustomCollections(customCollections.map(collection => 
      collection.id === collectionId 
        ? { ...collection, books: collection.books.filter(id => id !== bookId) }
        : collection
    ));
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>ShellBook</h1>
        <p className="app-subtitle">Ваш цифровой читательский дневник</p>
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
            onAddBookmark={addBookmark}
            bookmarks={bookmarks.filter(b => b.bookId === selectedBook.id)}
            onDeleteBookmark={deleteBookmark}
            onGoToBookmark={goToBookmark}
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
                customCollections={customCollections}
                onAddBookToCustomCollection={addBookToCustomCollection}
                onRemoveBookFromCustomCollection={removeBookFromCustomCollection}
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
                customCollections={customCollections}
                onCreateCustomCollection={createCustomCollection}
                onDeleteCustomCollection={deleteCustomCollection}
                onAddBookToCustomCollection={addBookToCustomCollection}
                onRemoveBookFromCustomCollection={removeBookFromCustomCollection}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
}

// Компонент чтения книги (остается без изменений)
function BookReader({ book, bookText, onBack, onAddNote, onAddBookmark, bookmarks, onDeleteBookmark, onGoToBookmark }) {
  const [noteText, setNoteText] = useState('');
  const [showNoteForm, setShowNoteForm] = useState(false);
  const [selectedText, setSelectedText] = useState('');
  const [selectionPosition, setSelectionPosition] = useState(0);
  const [showBookmarkForm, setShowBookmarkForm] = useState(false);
  const [bookmarkName, setBookmarkName] = useState('');

  // Обработчик выделения текста
  const handleTextSelection = () => {
    const selection = window.getSelection();
    const selectedText = selection.toString().trim();
    
    if (selectedText.length > 0) {
      setSelectedText(selectedText);
      // Сохраняем позицию выделения для закладки
      const range = selection.getRangeAt(0);
      const preSelectionRange = range.cloneRange();
      preSelectionRange.selectNodeContents(range.startContainer);
      preSelectionRange.setEnd(range.startContainer, range.startOffset);
      const position = preSelectionRange.toString().length;
      setSelectionPosition(position);
    } else {
      setSelectedText('');
    }
  };

  // Добавление заметки с выделенной цитатой
  const handleAddNoteWithQuote = () => {
    if (noteText.trim()) {
      onAddNote({
        bookId: book.id,
        bookTitle: book.title,
        text: noteText,
        quote: selectedText,
        position: selectionPosition
      });
      setNoteText('');
      setSelectedText('');
      setShowNoteForm(false);
      alert('Заметка с цитатой добавлена!');
    }
  };

  // Добавление закладки
  const handleAddBookmark = () => {
    if (bookmarkName.trim()) {
      onAddBookmark({
        bookId: book.id,
        bookTitle: book.title,
        name: bookmarkName,
        position: selectionPosition,
        textPreview: selectedText.substring(0, 100) + '...'
      });
      setBookmarkName('');
      setSelectedText('');
      setShowBookmarkForm(false);
      alert('Закладка добавлена!');
    }
  };

  // Разбиваем текст на части для отображения с закладками
  const renderBookText = () => {
    if (!bookText) return <div className="loading">Загрузка книги...</div>;

    const textParts = [];
    let lastPosition = 0;

    // Сортируем закладки по позиции
    const sortedBookmarks = [...bookmarks].sort((a, b) => a.position - b.position);

    sortedBookmarks.forEach(bookmark => {
      // Текст до закладки
      if (bookmark.position > lastPosition) {
        textParts.push({
          text: bookText.substring(lastPosition, bookmark.position),
          type: 'text',
          position: lastPosition
        });
      }

      // Закладка
      textParts.push({
        text: bookmark.textPreview,
        type: 'bookmark',
        bookmark: bookmark,
        position: bookmark.position
      });

      lastPosition = bookmark.position;
    });

    // Оставшийся текст после последней закладки
    if (lastPosition < bookText.length) {
      textParts.push({
        text: bookText.substring(lastPosition),
        type: 'text',
        position: lastPosition
      });
    }

    return textParts.map((part, index) => {
      if (part.type === 'bookmark') {
        return (
          <div key={`bookmark-${part.bookmark.id}`} className="bookmark-marker">
            <div className="bookmark-indicator" onClick={() => onGoToBookmark(part.position)}>
              🔖 {part.bookmark.name}
            </div>
            <div className="bookmark-text-preview">
              {part.text}
              <button 
                onClick={() => onDeleteBookmark(part.bookmark.id)}
                className="delete-bookmark-btn"
              >
                ×
              </button>
            </div>
          </div>
        );
      } else {
        return (
          <span 
            key={`text-${part.position}`}
            id={`text-${part.position}`}
            onMouseUp={handleTextSelection}
          >
            {part.text}
          </span>
        );
      }
    });
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
        <div className="reader-actions">
          <button 
            onClick={() => setShowNoteForm(!showNoteForm)}
            className="add-note-btn"
          >
            {showNoteForm ? 'Отменить' : '✏️ Заметка'}
          </button>
          <button 
            onClick={() => setShowBookmarkForm(!showBookmarkForm)}
            className="add-bookmark-btn"
            disabled={!selectedText}
          >
            🔖 Закладка
          </button>
        </div>
      </div>

      {/* Панель выделенного текста */}
      {selectedText && (
        <div className="selection-panel">
          <div className="selected-text">
            <strong>Выделенный текст:</strong> 
            <em>"{selectedText.substring(0, 100)}{selectedText.length > 100 ? '...' : ''}"</em>
          </div>
        </div>
      )}

      {/* Форма добавления заметки */}
      {showNoteForm && (
        <div className="note-form">
          <h4>Добавить заметку с цитатой</h4>
          {selectedText && (
            <div className="selected-quote">
              <strong>Цитата:</strong> "{selectedText}"
            </div>
          )}
          <textarea
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            placeholder="Запишите ваши мысли о прочитанном..."
            className="note-textarea"
            rows="4"
          />
          <button 
            onClick={handleAddNoteWithQuote}
            className="save-note-btn"
            disabled={!noteText.trim()}
          >
            Сохранить заметку
          </button>
        </div>
      )}

      {/* Форма добавления закладки */}
      {showBookmarkForm && (
        <div className="bookmark-form">
          <h4>Добавить закладку</h4>
          {selectedText && (
            <div className="selected-quote">
              <strong>Текст рядом:</strong> "{selectedText.substring(0, 100)}..."
            </div>
          )}
          <input
            type="text"
            value={bookmarkName}
            onChange={(e) => setBookmarkName(e.target.value)}
            placeholder="Название закладки (например: Интересный момент)"
            className="bookmark-input"
          />
          <button 
            onClick={handleAddBookmark}
            className="save-bookmark-btn"
            disabled={!bookmarkName.trim()}
          >
            Сохранить закладку
          </button>
        </div>
      )}

      {/* Список закладок */}
      {bookmarks.length > 0 && (
        <div className="bookmarks-sidebar">
          <h4>📑 Закладки ({bookmarks.length})</h4>
          {bookmarks.map(bookmark => (
            <div key={bookmark.id} className="bookmark-item">
              <div 
                className="bookmark-name"
                onClick={() => onGoToBookmark(bookmark.position)}
              >
                {bookmark.name}
              </div>
              <div className="bookmark-preview">{bookmark.textPreview}</div>
              <button 
                onClick={() => onDeleteBookmark(bookmark.id)}
                className="delete-bookmark-btn"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Текст книги */}
      <div className="book-text">
        {renderBookText()}
      </div>
    </div>
  );
}

// Обновленный компонент библиотеки с кнопками для пользовательских коллекций
function LibrarySection({ books, onAddNote, onAddToCollection, onRemoveFromCollection, onReadBook, customCollections, onAddBookToCustomCollection, onRemoveBookFromCustomCollection }) {
  const [selectedBookForNote, setSelectedBookForNote] = useState(null);
  const [noteText, setNoteText] = useState('');
  const [showCustomCollections, setShowCustomCollections] = useState(null);

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

  const isBookInCustomCollection = (bookId, collectionId) => {
    const collection = customCollections.find(c => c.id === collectionId);
    return collection ? collection.books.includes(bookId) : false;
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
              
              {/* Основные коллекции */}
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

              {/* Пользовательские коллекции */}
              {customCollections.length > 0 && (
                <div style={{marginTop: '10px'}}>
                  <button 
                    onClick={() => setShowCustomCollections(showCustomCollections === book.id ? null : book.id)}
                    className="custom-collections-toggle"
                    style={{
                      width: '100%',
                      padding: '8px',
                      background: 'transparent',
                      border: '1px solid #a8c0d6',
                      borderRadius: '10px',
                      color: '#7bb3d1',
                      cursor: 'pointer',
                      fontSize: '0.8rem'
                    }}
                  >
                    {showCustomCollections === book.id ? '▲' : '▼'} Мои коллекции
                  </button>
                  
                  {showCustomCollections === book.id && (
                    <div className="custom-collections-list" style={{marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '5px'}}>
                      {customCollections.map(collection => (
                        <button
                          key={collection.id}
                          onClick={() => {
                            if (isBookInCustomCollection(book.id, collection.id)) {
                              onRemoveBookFromCustomCollection(collection.id, book.id);
                            } else {
                              onAddBookToCustomCollection(collection.id, book.id);
                            }
                          }}
                          style={{
                            padding: '5px 8px',
                            background: isBookInCustomCollection(book.id, collection.id) ? '#a8c0d6' : 'transparent',
                            border: '1px solid #a8c0d6',
                            borderRadius: '8px',
                            fontSize: '0.7rem',
                            color: isBookInCustomCollection(book.id, collection.id) ? 'white' : '#7bb3d1',
                            cursor: 'pointer'
                          }}
                        >
                          {isBookInCustomCollection(book.id, collection.id) ? '✓ ' : ''}{collection.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Компонент заметок (без изменений)
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
                  <strong>Цитата:</strong> "{note.quote}"
                </div>
              )}
              <button 
                onClick={() => onDeleteNote(note.id)}
                className="delete-note-btn"
              >
                Удалить
              </button>
            </div>
          )).reverse()
        )}
      </div>
    </div>
  );
}

// Обновленный компонент коллекций с пользовательскими коллекциями
function CollectionsSection({ books, onAddToCollection, onRemoveFromCollection, onReadBook, customCollections, onCreateCustomCollection, onDeleteCustomCollection, onAddBookToCustomCollection, onRemoveBookFromCustomCollection }) {
  const favorites = books.filter(book => book.collection === 'favorites');
  const planned = books.filter(book => book.collection === 'planned');
  const read = books.filter(book => book.collection === 'read');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState('');
  const [newCollectionDescription, setNewCollectionDescription] = useState('');

  const handleCreateCollection = () => {
    if (newCollectionName.trim()) {
      onCreateCustomCollection({
        name: newCollectionName,
        description: newCollectionDescription,
        color: `hsl(${Math.random() * 360}, 70%, 80%)`
      });
      setNewCollectionName('');
      setNewCollectionDescription('');
      setShowCreateForm(false);
      alert('Коллекция создана!');
    }
  };

  const CollectionCard = ({ title, description, books, icon, type, onDelete, isCustom = false }) => (
    <div className={`collection-card ${type}`} style={isCustom ? { background: type } : {}}>
      <h3>{icon} {title}</h3>
      <p>{description}</p>
      <div style={{marginTop: '15px', fontSize: '0.9rem'}}>
        Книг в коллекции: <strong>{books.length}</strong>
      </div>
      {isCustom && onDelete && (
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="delete-collection-btn"
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            background: 'rgba(255,255,255,0.3)',
            border: 'none',
            borderRadius: '50%',
            width: '25px',
            height: '25px',
            cursor: 'pointer',
            color: 'white',
            fontSize: '0.8rem'
          }}
        >
          ×
        </button>
      )}
    </div>
  );

  const BookInCollection = ({ book, onRemove, onRead, showCustomCollections = false, customCollections = [], onAddToCustom, onRemoveFromCustom }) => (
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

  const getBooksInCustomCollection = (collection) => {
    return books.filter(book => collection.books.includes(book.id));
  };

  return (
    <div>
      <h2>Мои коллекции</h2>
      
      {/* Кнопка создания новой коллекции */}
      <div style={{marginBottom: '30px'}}>
        <button 
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="create-collection-btn"
          style={{
            padding: '15px 25px',
            background: 'linear-gradient(135deg, #a8d8ea 0%, #7bb3d1 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '25px',
            cursor: 'pointer',
            fontSize: '1rem',
            boxShadow: '0 4px 15px rgba(123, 179, 209, 0.3)'
          }}
        >
          + Создать новую коллекцию
        </button>

        {showCreateForm && (
          <div className="create-collection-form" style={{
            background: 'linear-gradient(135deg, #f8f7fc 0%, #e8e6f2 100%)',
            padding: '20px',
            borderRadius: '15px',
            marginTop: '15px',
            border: '1px solid #e8e6f2'
          }}>
            <h4>Создать новую коллекцию</h4>
            <input
              type="text"
              value={newCollectionName}
              onChange={(e) => setNewCollectionName(e.target.value)}
              placeholder="Название коллекции"
              className="collection-name-input"
              style={{
                width: '100%',
                padding: '12px 15px',
                border: '1px solid #a8c0d6',
                borderRadius: '10px',
                fontSize: '1rem',
                marginBottom: '10px'
              }}
            />
            <textarea
              value={newCollectionDescription}
              onChange={(e) => setNewCollectionDescription(e.target.value)}
              placeholder="Описание коллекции"
              className="collection-description-input"
              style={{
                width: '100%',
                padding: '12px 15px',
                border: '1px solid #a8c0d6',
                borderRadius: '10px',
                fontSize: '1rem',
                marginBottom: '15px',
                resize: 'vertical',
                minHeight: '60px'
              }}
            />
            <button 
              onClick={handleCreateCollection}
              className="save-collection-btn"
              disabled={!newCollectionName.trim()}
              style={{
                padding: '12px 25px',
                background: newCollectionName.trim() ? 'linear-gradient(135deg, #a8d8b9 0%, #7bc1a3 100%)' : '#d1d1e0',
                color: 'white',
                border: 'none',
                borderRadius: '25px',
                cursor: newCollectionName.trim() ? 'pointer' : 'not-allowed',
                fontSize: '1rem'
              }}
            >
              Создать коллекцию
            </button>
          </div>
        )}
      </div>
      
      <div className="collections-grid">
        {/* Стандартные коллекции */}
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

        {/* Пользовательские коллекции */}
        {customCollections.map(collection => (
          <CollectionCard 
            key={collection.id}
            title={collection.name} 
            description={collection.description}
            books={getBooksInCustomCollection(collection)}
            icon="📂"
            type={collection.color}
            onDelete={() => onDeleteCustomCollection(collection.id)}
            isCustom={true}
          />
        ))}
      </div>

      {/* Детали коллекций */}
      <div style={{marginTop: '40px'}}>
        <h3>Книги в коллекциях</h3>
        
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', marginTop: '20px'}}>
          {/* Стандартные коллекции */}
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

          {/* Пользовательские коллекции */}
          {customCollections.map(collection => {
            const collectionBooks = getBooksInCustomCollection(collection);
            return (
              <div key={collection.id}>
                <h4 style={{color: '#7bb3d1', marginBottom: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                  <span>📂 {collection.name} ({collectionBooks.length})</span>
                  <button 
                    onClick={() => onDeleteCustomCollection(collection.id)}
                    className="delete-collection-small-btn"
                    style={{
                      background: 'transparent',
                      border: '1px solid #e74c3c',
                      borderRadius: '15px',
                      color: '#e74c3c',
                      cursor: 'pointer',
                      fontSize: '0.7rem',
                      padding: '2px 8px'
                    }}
                  >
                    Удалить
                  </button>
                </h4>
                {collectionBooks.length === 0 ? (
                  <p style={{color: '#9e9bb6', fontStyle: 'italic'}}>Пока нет книг в этой коллекции</p>
                ) : (
                  collectionBooks.map(book => (
                    <BookInCollection 
                      key={book.id} 
                      book={book} 
                      onRemove={(bookId) => onRemoveBookFromCustomCollection(collection.id, bookId)}
                      onRead={onReadBook}
                    />
                  ))
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default App;