import React from 'react';
import {Duplicate2} from '../../src/Icons';
import s from './style.scss';

export default () => {
  const style = {
    color: '#eee'
  };

  return (
    <div className={s.iconList}>
      <div className={s.singleIconView}>
        <span><Duplicate2 width="2em" height="2em" style={style}/></span>
        <span className={s.iconName}>Duplicate2</span>
      </div>
    </div>
  );
};
