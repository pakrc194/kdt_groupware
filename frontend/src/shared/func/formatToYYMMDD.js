import React from 'react';

const formatToYYMMDD = (input) => {

  if (typeof input === 'string' && input.length >= 8) {
    const yy = input.slice(2, 4);
    const mm = input.slice(4, 6);
    const dd = input.slice(6, 8);
    return `${yy}.${mm}.${dd}`;
  }

  if (input instanceof Date && !isNaN(input)) {
    const yy = String(input.getFullYear()).slice(2);
    const mm = String(input.getMonth() + 1).padStart(2, '0');
    const dd = String(input.getDate()).padStart(2, '0');
    console.log(`✅ formatted: ${yy}.${mm}.${dd}`);
    return `${yy}.${mm}.${dd}`;
  }

  console.warn("❗ formatToYYMMDD(): invalid input", input);
  return '';
};


export default formatToYYMMDD;
