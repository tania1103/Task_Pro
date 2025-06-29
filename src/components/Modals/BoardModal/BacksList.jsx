import { useState, useEffect } from 'react';
import backgrounds from 'images/background/backgrounds';

import { BacksUl, BackInputRadio, BackImage } from './BoardModal.styled';

export const BacksList = ({
  backgroundId,
  customBackground,
  onSelectBackground,
}) => {
  const [selectedBackId, setSelectedBackId] = useState(backgroundId);
  const [imageErrors, setImageErrors] = useState({});

  useEffect(() => {
    setSelectedBackId(backgroundId);
  }, [backgroundId]);

  const handleBackChange = e => {
    const id = Number(e.target.value);
    setSelectedBackId(id);
    if (onSelectBackground) onSelectBackground(id);
  };

  const handleImageError = id => {
    setImageErrors(prev => ({ ...prev, [id]: true }));
  };

  return (
    <BacksUl>
      {backgrounds.map(bg => (
        <li key={bg.id}>
          <label
            title={`Background ${bg.id}`}
            aria-label={`Select background ${bg.id}`}
          >
            <BackInputRadio
              type="radio"
              name="background" // 👈 necesar pentru FormData
              value={`${bg.id}`} // 👈 valoare ca string
              checked={!customBackground && selectedBackId === bg.id}
              onChange={handleBackChange}
            />
            <BackImage
              src={
                imageErrors[bg.id]
                  ? 'https://via.placeholder.com/28?text=🚫'
                  : bg.min
              }
              alt={
                imageErrors[bg.id]
                  ? `Background ${bg.id} unavailable`
                  : `Background preview ${bg.id}`
              }
              width={28}
              height={28}
              onError={() => handleImageError(bg.id)}
            />
          </label>
        </li>
      ))}
    </BacksUl>
  );
};
