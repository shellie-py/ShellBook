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
  return <div>Библиотека - здесь будут книги</div>;
}

function NotesSection() {
  return <div>Заметки - здесь будут ваши мысли о книгах</div>;
}

function CollectionsSection() {
  return <div>Коллекции - избранное, прочитано, в планах</div>;
}

export default App;