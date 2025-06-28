// Selectori de stare autentificare
export const selectIsLoggedIn = ({ auth }) => auth.isLoggedIn;
export const selectIsRefreshing = ({ auth }) => auth.isRefreshing;
export const selectIsLoading = ({ auth }) => auth.isLoading;

// Selectori de utilizator
export const selectUser = ({ auth }) => auth.user;
export const selectUsername = ({ auth }) => auth.user?.name || '';
export const selectUserEmail = ({ auth }) => auth.user?.email || '';
export const selectUserAvatar = ({ auth }) => {
  return auth.user?.profileImage || 'default';
};

// Selectori de tokeni (dacă ai nevoie)
export const selectAccessToken = ({ auth }) => auth.token;
export const selectRefreshToken = ({ auth }) => auth.refreshToken;

// Selectori de erori (opțional)
export const selectAuthError = ({ auth }) => auth.error;
