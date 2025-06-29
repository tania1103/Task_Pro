import React, { useState, useEffect } from 'react';
import sprite from 'assets/images/icons/icons-sprite.svg';
import { ICONS_ARRAY } from 'constants/index';
import { IconsUl, IconSVG, InputRadio } from './BoardModal.styled';

export const IconsList = ({ iconId = 0, onIconChange }) => {
  const [selectedIconId, setSelectedIconId] = useState(iconId);

  useEffect(() => {
    const selected = ICONS_ARRAY.find(icon => icon.id === iconId);
    if (selected && onIconChange) {
      onIconChange(selected.value); // trimite emoji-ul inițial către BoardModal
    }
  }, [iconId, onIconChange]);

  const handleChange = icon => {
    setSelectedIconId(icon.id);
    if (onIconChange) {
      onIconChange(icon.value); // trimite emoji-ul selectat
    }
  };

  return (
    <IconsUl>
      {ICONS_ARRAY.map(item => (
        <li key={item.id}>
          <label>
            <InputRadio
              type="radio"
              name="icon"
              value={item.value}
              checked={selectedIconId === item.id}
              onChange={() => handleChange(item)}
            />
            <IconSVG width="18" height="18">
              <use xlinkHref={`${sprite}#${item.name}`} />
            </IconSVG>
          </label>
        </li>
      ))}
    </IconsUl>
  );
};
