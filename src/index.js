import React from 'react';
import ReactDOM from 'react-dom';

import style from './index.less';

const App = () => {
  return <div className={style.app}>app</div>;
};

ReactDOM.render(<App />, document.getElementById('root'));
