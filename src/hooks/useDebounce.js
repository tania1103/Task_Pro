import { useMemo } from 'react';
import debounce from 'lodash.debounce';

/**
 * Hook personalizat pentru debounce
 * @param {Function} callback - Funcția care trebuie debounced
 * @param {number} delay - Întârzierea în milisecunde
 * @param {Array} dependencies - Dependențe pentru useMemo
 * @returns {Function} - Funcția debounced
 */
const useDebounce = (callback, delay = 300, dependencies = []) => {
  return useMemo(
    () => debounce(callback, delay),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [delay, ...dependencies]
  );
};

export default useDebounce;
