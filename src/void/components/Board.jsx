import React from 'react';

import sky from '../../image/sky.gif'

const style = (dimension) => {
    const dim = dimension + 'px';
    return {
        width: dim,
        height: dim,
        border: '1px solid black',
        position: 'relative',
        margin: '25px auto',
        overflow: 'hidden',
        backgroundImage: `url(${sky})`,

    };
};

export default ({ dimension, children }) => (
    <div style={style(dimension)}>
        {children}
    </div>
)