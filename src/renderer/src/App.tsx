import "@aws-amplify/ui-react/styles.css";
import "@aws-amplify/ui-react/styles/reset.layer.css"; // global CSS reset
import "@aws-amplify/ui-react/styles/base.layer.css"; // base styling needed for Amplify UI
import "@aws-amplify/ui-react/styles/button.layer.css"; // component specific styles
import { Amplify } from "aws-amplify";
import { useAuthContext } from "./core/context";
import { SignInScreen } from "./features/user/screens";
import { ScheduleScreen } from "./features/schedule/screens";
import { SelectCountry } from "./components";
import { Box, CircularProgress } from "@mui/material";

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: import.meta.env.VITE_APP_COGNITO_USER_POOL_ID,
      userPoolClientId: import.meta.env.VITE_APP_COGNITO_USER_POOL_CLIENT_ID,
      identityPoolId: import.meta.env.VITE_APP_COGNITO_IDENTITY_POOL_ID,
      loginWith: {
        email: true,
      },
      signUpVerificationMethod: "code",
      userAttributes: {
        email: {
          required: true,
        },
      },
      allowGuestAccess: false,
      passwordFormat: {
        minLength: 8,
        requireLowercase: true,
        requireUppercase: true,
        requireNumbers: true,
        requireSpecialCharacters: true,
      },
    },
  },
});

function App(): React.JSX.Element {
  const { isAuthenticated, showSelectCountry, isLoading } = useAuthContext();

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          paddingTop: 10,
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated) {
    return <SignInScreen />;
  }

  if (!showSelectCountry) {
    return <SelectCountry />;
  }

  return <ScheduleScreen />;
}

export default App;
