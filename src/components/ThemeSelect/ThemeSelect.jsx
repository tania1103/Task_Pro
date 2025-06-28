import { useState } from 'react';
import { useDispatch } from 'react-redux';
import Select from 'react-select';
import { useTranslation } from 'react-i18next';
import { updateTheme } from '../../redux/theme/themeOperation';
import { useTheme } from '../../hooks/useTheme';
import './ThemeSelect.css';
import { SelectWrap } from './ThemeSelect.styled';

function ThemeSelect() {
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  useTheme(); // aplică tema din Redux când se schimbă
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const THEME_OPTIONS = [
    { value: 'light', label: t('header.theme1') },
    { value: 'dark', label: t('header.theme2') },
    { value: 'violet', label: t('header.theme3') },
  ];

  const onChangeTheme = option => {
    console.log('📦 Se trimite tema:', option.value);
    dispatch(updateTheme(option.value)); // doar string
  };

  return (
    <SelectWrap $isMenuOpen={isSelectOpen}>
      <Select
        classNamePrefix="custom-select"
        options={THEME_OPTIONS}
        placeholder={t('header.theme')}
        isSearchable={false}
        onChange={onChangeTheme}
        onMenuOpen={() => setIsSelectOpen(true)}
        onMenuClose={() => setIsSelectOpen(false)}
      />
    </SelectWrap>
  );
}

export default ThemeSelect;
