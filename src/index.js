// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import { BrowserRouter } from 'react-router-dom';
// // import { Provider } from 'react-redux';
// // import 'modern-normalize';
// import GlobalStyles from 'assets/styles/GlobalStyles';
// // import './index.css';
// import App from 'components/App/App';
// // import { PersistGate } from 'redux-persist/integration/react';
// // import { store, persistor } from './redux/store';
// // import '../src/assets/i18/i18';

// ReactDOM.createRoot(document.getElementById('root')).render(

//       <BrowserRouter basename="/task_pro">
//         <GlobalStyles />
//         <App />
//       </BrowserRouter>

// );

import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './redux/store'; // or wherever you defined it
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import 'modern-normalize';
import GlobalStyles from 'assets/styles/GlobalStyles';
import './index.css';
import App from 'components/App/App';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './redux/store';
import '../src/assets/i18/i18';

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <BrowserRouter basename="/Task_Pro">
        <GlobalStyles />
        <App />
      </BrowserRouter>
    </PersistGate>
  </Provider>
);
