import React from 'react';

import cloud from '../../image/cloud.png'

const style = ({ size, position, color }) => {
    const dim = size + 'px';
    return {
        width: "40px",
        height: "30px",
        backgroundImage: `url(${cloud})`,
        backgroundSize:'contain',
        backgroundRepeat:"no-repeat",
        position: 'absolute',
        top: position.top + 'px',
        left: position.left + 'px',
        transition: 'all 0.1s ease'
    };
};

export default (props) => <div style={style(props)}/>