import { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logIn } from '../../../redux/auth/authOperations';
import { useAuth } from 'hooks/useAuth';
import { loginSchema } from 'schemas';
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
} from './LoginForm.styled';
import Eye from 'components/Icons/Eye';
import EyeCrossed from 'components/Icons/EyeCrossed';

const LoginForm = () => {
  const [visible, setVisible] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isLoading, isLoggedIn } = useAuth();

  const onSubmit = (values, actions) => {
    dispatch(
      logIn({
        email: values.email,
        password: values.password,
      })
    );
    actions.resetForm();
  };

  const {
    values,
    errors,
    touched,
    isSubmitting,
    handleBlur,
    handleChange,
    handleSubmit,
  } = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: loginSchema,
    onSubmit,
  });

  // ✅ Redirecționează către dashboard după login
  useEffect(() => {
    if (isLoggedIn) {
      navigate('/dashboard');
    }
  }, [isLoggedIn, navigate]);

  return (
    <Background>
      <FormWrap>
        <AuthList>
          <li>
            <AuthLink to="/auth/register">Register</AuthLink>
          </li>
          <li>
            <AuthLink to="/auth/login">Login</AuthLink>
          </li>
        </AuthList>

        <FormUi onSubmit={handleSubmit} autoComplete="off">
          {/* Email */}
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

          {/* Password */}
          <label htmlFor="password">
            <PassInputWrap>
              <Input
                id="password"
                name="password"
                type={visible ? 'text' : 'password'}
                placeholder="Password"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                $error={errors.password && touched.password}
                aria-describedby="password-error"
                aria-invalid={!!(errors.password && touched.password)}
                required
                autoComplete="current-password"
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

          {/* Submit */}
          <SubmitBtn type="submit" disabled={isSubmitting || isLoading}>
            Login
          </SubmitBtn>
        </FormUi>
      </FormWrap>
    </Background>
  );
};

export default LoginForm;
