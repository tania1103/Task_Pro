import { useLayoutEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectTheme } from '../redux/theme/themeSelector';

export const useTheme = () => {
  const theme = useSelector(selectTheme);

  useLayoutEffect(() => {
    if (typeof theme === 'string') {
      console.log('🎨 Tema activă în Redux:', theme); // ← mutat aici
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('app-theme', theme);
    }
  }, [theme]);

  return { theme };
};
