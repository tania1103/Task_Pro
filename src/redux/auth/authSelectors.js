export const selectUsername = ({ auth }) => auth.user?.name || '';
export const selectUserEmail = ({ auth }) => auth.user?.email || '';
export const selectUserAvatar = ({ auth }) => auth.user?.avatar_url || '';
export const selectIsLoggedIn = ({ auth }) => auth.isLoggedIn;
export const selectIsRefreshing = ({ auth }) => auth.isRefreshing || false;
export const selectIsLoading = ({ auth }) => auth.isLoading || false;
