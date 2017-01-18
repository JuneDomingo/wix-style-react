import React, {PropTypes} from 'react';
import s from './Icon.scss';

const Icon = ({children, width, height, ...props}) => {

  return (
    <svg
      className={s.iconDefault}
      width={width}
      height={height}
      preserveAspectRatio="xMidYMid meet"
      {...props}
      >
      {children}
    </svg>
  );
};

Icon.propTypes = {
  width: PropTypes.string,
  height: PropTypes.string,
  children: PropTypes.any
};

export default Icon;
