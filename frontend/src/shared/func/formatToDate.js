import React from 'react';

export const formatToYYMMDD = (input) => {

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


export const formatToYYMMDDHHMMSS = (date) => {
        const yy = String(date.getFullYear());
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const dd = String(date.getDate()).padStart(2, '0');
        const hh = String(date.getHours()).padStart(2, '0');
        const mi = String(date.getMinutes()).padStart(2, '0');
        const ss = String(date.getSeconds()).padStart(2, '0');

        return `${yy}${mm}${dd}${hh}${mi}${ss}`;
    };