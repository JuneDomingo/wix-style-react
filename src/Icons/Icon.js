import React, {PropTypes} from 'react';
import s from './Icon.scss';

const Icon = ({children, size, ...props}) => {

  return (
    <svg
      className={s.iconDefault}
      width={size}
      height={size}
      {...props}
      >
      {children}
    </svg>
  );
};

Icon.defaultProps = {
  size: '1em'
};

Icon.propTypes = {
  size: PropTypes.string,
  children: PropTypes.any
};

export default Icon;
