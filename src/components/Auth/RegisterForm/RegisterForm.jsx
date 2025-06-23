import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useFormik } from 'formik';
import PasswordStrengthBar from 'react-password-strength-bar';
import { register } from '../../../redux/auth/authOperations';
import { useAuth } from 'hooks/useAuth';
import { registerSchema } from 'schemas';
import { PROGRESS_BAR_COLORS } from 'constants';
// import SmallLoader from 'components/Loader/SmallLoader';
import {
  Background,
  FormWrap,
  AuthList,
  AuthLink,
  FormUi,
  Input,
  SubmitBtn,
  ErrorPara,
  PassInputWrap,
  HideBtn,
} from './RegisterForm.styled'; // presupun că ai separat stilurile
import Eye from 'components/Icons/Eye';
import EyeCrossed from 'components/Icons/EyeCrossed';

const RegisterForm = () => {
  const [visible, setVisible] = useState(false);
  const [pwd, setPwd] = useState('');

  const dispatch = useDispatch();
  const { isLoading } = useAuth();

  const onSubmit = (values, actions) => {
    dispatch(
      register({
        name: values.name,
        email: values.email,
        password: values.password,
      })
    );
    actions.resetForm();
  };

  const { values, errors, touched, handleBlur, handleChange, handleSubmit } =
    useFormik({
      initialValues: {
        name: '',
        email: '',
        password: '',
      },
      validationSchema: registerSchema,
      onSubmit,
    });

  return (
    <Background>
      <FormWrap>
        <AuthList>
          <li>
            <AuthLink to="/auth/register" aria-current="page">
              Register
            </AuthLink>
          </li>
          <li>
            <AuthLink to="/auth/login">Login</AuthLink>
          </li>
        </AuthList>

        <FormUi onSubmit={handleSubmit} autoComplete="off">
          <label htmlFor="name">
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="Name"
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
              $error={errors.name && touched.name}
              aria-describedby="name-error"
              aria-invalid={!!(errors.name && touched.name)}
              required
            />
            {errors.name && touched.name && (
              <ErrorPara id="name-error">{errors.name}</ErrorPara>
            )}
          </label>

          <label htmlFor="email">
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Email"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              $error={errors.email && touched.email}
              aria-describedby="email-error"
              aria-invalid={!!(errors.email && touched.email)}
              required
              autoComplete="username"
            />

            {errors.email && touched.email && (
              <ErrorPara id="email-error">{errors.email}</ErrorPara>
            )}
          </label>

          <label htmlFor="password">
            <PassInputWrap>
              <Input
                id="password"
                name="password"
                type={visible ? 'text' : 'password'}
                placeholder="Password"
                value={values.password}
                onChange={e => {
                  setPwd(e.target.value);
                  handleChange(e);
                }}
                onBlur={handleBlur}
                $error={errors.password && touched.password}
                aria-describedby="password-error"
                aria-invalid={!!(errors.password && touched.password)}
                required
                autoComplete="new-password"
              />

              <HideBtn
                type="button"
                onClick={() => setVisible(!visible)}
                aria-label={visible ? 'Hide password' : 'Show password'}
              >
                {visible ? (
                  <Eye
                    width={20}
                    height={20}
                    fillColor="none"
                    strokeColor="#fff"
                  />
                ) : (
                  <EyeCrossed
                    width={20}
                    height={20}
                    fillColor="none"
                    strokeColor="#fff"
                  />
                )}
              </HideBtn>
            </PassInputWrap>
            {errors.password && touched.password && (
              <ErrorPara id="password-error">{errors.password}</ErrorPara>
            )}
          </label>

          {pwd && (
            <PasswordStrengthBar
              password={pwd}
              minLength={6}
              barColors={PROGRESS_BAR_COLORS}
            />
          )}

          <SubmitBtn type="submit" disabled={isLoading}>
            Register
          </SubmitBtn>
        </FormUi>
      </FormWrap>
    </Background>
  );
};

export default RegisterForm;
