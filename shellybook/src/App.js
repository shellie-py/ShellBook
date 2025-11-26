import React, { useState } from 'react';
import './App.css';

function App() {
  const [currentSection, setCurrentSection] = useState('library');

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
        {currentSection === 'library' && <LibrarySection />}
        {currentSection === 'notes' && <NotesSection />}
        {currentSection === 'collections' && <CollectionsSection />}
      </main>
    </div>
  );
}

// Базовые компоненты секций (пока заглушки)
function LibrarySection() {
  const books = [
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
  ];

  return (
    <div>
      <h2>Библиотека</h2>
      <div className="books-grid">
        {books.map(book => (
          <div key={book.id} className="book-card">
            <div className="book-title">{book.title}</div>
            <div className="book-author">{book.author}, {book.year}</div>
            <div className="book-description">{book.description}</div>
            <button className="add-note-btn">Добавить заметку</button>
          </div>
        ))}
      </div>
    </div>
  );
}

function NotesSection() {
  return <div>Заметки - здесь будут ваши мысли о книгах</div>;
}

function CollectionsSection() {
  return <div>Коллекции - избранное, прочитано, в планах</div>;
}

export default App;