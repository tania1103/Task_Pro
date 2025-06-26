import { Toaster } from 'react-hot-toast';
import GlobalStyles from 'assets/styles/GlobalStyles';
import MainPage from 'pages/MainPage';

const App = () => {
  const dispatch = useDispatch();
  const { currentTheme } = useThemeManager();
  const theme = getTheme(currentTheme);

  // Check if user is logged in on app load
  useEffect(() => {
    const token = localStorage.getItem('taskpro_token');
    if (token) {
      dispatch(refreshToken(token))
        .unwrap()
        .then(() => {
          // Fetch boards after successful authentication
          dispatch(fetchBoards());
        })
        .catch(() => {
          // Token is invalid, do nothing
        });
    }
  }, [dispatch]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route element={<PublicRoute />}>
            <Route element={<AuthLayout />}>
              <Route path="/auth/login" element={<LoginPage />} />
              <Route path="/auth/register" element={<RegisterPage />} />
            </Route>
          </Route>

          {/* Private Routes */}
          <Route element={<PrivateRoute />}>
            <Route element={<AppLayout />}>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/boards/:boardId" element={<BoardPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/help" element={<HelpPage />} />
            </Route>
          </Route>

          {/* Redirect to login for unknown routes */}
          <Route path="*" element={<Navigate to="/auth/login" replace />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};
export default App;
