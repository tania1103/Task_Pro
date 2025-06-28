import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { useSelector, useDispatch } from 'react-redux';
import {
  editUserAvatar,
  editUserInfo,
} from '../../../redux/auth/authOperations';
import {
  selectUser,
  selectUsername,
  selectUserEmail,
  selectUserAvatar,
} from '../../../redux/auth/authSelectors';
import { TOASTER_CONFIG } from 'constants';
import { validateInputMaxLength } from 'helpers';
import { editUserSchema } from 'schemas';
import Eye from 'components/Icons/Eye';
import EyeCrossed from 'components/Icons/EyeCrossed';
import Plus from 'components/Icons/Plus';
import User from 'components/Icons/User';
import {
  AddPhoto,
  Avatar,
  EyeBtn,
  FormUser,
  Input,
  InputPass,
  UserNameLabel,
  InputUser,
  PlusButton,
  SendBtn,
  AvatarEdit,
} from './UserModal.styled';

const UserModal = ({ onClose }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const [visible, setVisible] = useState(false);
  const reduxProfileImage = useSelector(selectUserAvatar);
  // Eliminăm useState pentru profileImage, folosind direct reduxProfileImage
  const [profileImage, setprofileImage] = useState(reduxProfileImage);
  // Folosim reduxProfileImage pentru a actualiza profileImage la montare
  const [name, setName] = useState(useSelector(selectUsername));
  const [email, setEmail] = useState(useSelector(selectUserEmail));
  const [password, setPassword] = useState('');
  const [preview, setPreview] = useState(null);
  const [errorMsgShown, setErrorMsgShown] = useState(false);
  const [errorClassName, setErrorClassName] = useState('');
  const user = useSelector(selectUser);

  useEffect(() => {
    setprofileImage(reduxProfileImage);
  }, [reduxProfileImage]);

  // Update name and email when user changes info
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
    }
  }, [user]);

  function changeImg(event) {
    setprofileImage(event.target.files[0]);
    const file = new FileReader();
    file.onload = function () {
      setPreview(file.result);
    };
    file.readAsDataURL(event.target.files[0]);
  }

  const handleInputChange = event => {
    const { name, value } = event.target;

    if (name === 'name') {
      validateInputMaxLength(event, setErrorMsgShown, setErrorClassName);
    }

    switch (name) {
      case 'name':
        setName(value);
        break;
      case 'email':
        setEmail(value);
        break;
      case 'password':
        setPassword(value);
        break;
      default:
        break;
    }
  };

  function editProfile(event) {
    event.preventDefault();

    const info = { name, email };
    if (password) info.password = password;

    editUserSchema
      .validate({ ...info })
      .then(valid => {
        // If profileImage was changed, dispatch editUserAvatar
        if (profileImage instanceof File) {
          dispatch(editUserAvatar({ profileImage }));
        }

        dispatch(editUserInfo(info));

        toast(t('editUser.toast.editUserSuccess'), TOASTER_CONFIG);
        onClose();
      })
      .catch(error => {
        toast(error.message, TOASTER_CONFIG);
      });
  }

  return (
    <div>
      <h3>{t('editUser.title')}</h3>
      <FormUser onSubmit={editProfile}>
        <Avatar>
          <AvatarEdit>
            {profileImage !== 'default' ? (
              <img
                src={
                  preview ||
                  (typeof profileImage === 'string' ? profileImage : '')
                }
                alt="avatar"
                style={{ width: 68, height: 68, objectFit: 'cover' }}
              />
            ) : (
              <User
                width={68}
                height={68}
                strokeColor={'var( --svg-back-color-user)'}
                fillColor={'var(--svg-color-user)'}
              />
            )}
            <PlusButton>
              <Plus
                width={20}
                height={20}
                strokeColor={'var(--sidebar-plus-icon)'}
              />
              <AddPhoto
                type="file"
                accept=".png, .jpg, .jpeg"
                onChange={changeImg}
              />
            </PlusButton>
          </AvatarEdit>
        </Avatar>
        <UserNameLabel>
          <InputUser
            className={errorClassName}
            type="text"
            placeholder="Name"
            value={name}
            name="name"
            autoComplete={'username'}
            onChange={handleInputChange}
          />
          {errorMsgShown && <p>{t('editUser.toast.maxLength')}</p>}
        </UserNameLabel>
        <InputUser
          type="email"
          placeholder="Email"
          value={email}
          name="email"
          autoComplete={'email'}
          onChange={handleInputChange}
        />
        <InputPass>
          <Input
            type={visible ? 'text' : 'password'}
            placeholder="Password"
            value={password}
            name="password"
            autoComplete={'current-password'}
            onChange={handleInputChange}
          />
          <EyeBtn
            type="button"
            onClick={() => {
              setVisible(!visible);
            }}
          >
            {visible ? (
              <Eye
                width={20}
                height={20}
                fillColor={'none'}
                strokeColor={'var(--icon-stroke-color)'}
              />
            ) : (
              <EyeCrossed
                width={20}
                height={20}
                strokeColor={'var(--icon-stroke-color)'}
                fillColor={'none'}
              />
            )}
          </EyeBtn>
        </InputPass>
        <SendBtn type="submit">{t('editUser.button')}</SendBtn>
      </FormUser>
    </div>
  );
};

export default UserModal;
