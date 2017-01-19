import React from 'react';
import {Duplicate2} from '../../src/Icons';
import s from './style.scss';

export default () => {
  const style = {
    color: '#F00'
  };

  return (
    <div className={s.iconList}>
      <div className={s.singleIconView}>
        <span><Duplicate2 size="3em" style={style}/></span>
        <span className={s.iconName}>Duplicate2 (size x 3, red)</span>
      </div>
    </div>
  );
};
