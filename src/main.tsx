import React from 'react';
import ReactDOM from 'react-dom/client';
import faviconUrl from '../images/icon.svg?url';
import App from './App';
import './styles.css';

document.querySelector<HTMLLinkElement>('link[rel="icon"]')?.setAttribute('href', faviconUrl);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
