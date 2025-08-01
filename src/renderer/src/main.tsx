import './assets/main.css'

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { Authenticator } from '@aws-amplify/ui-react'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Authenticator
      hideSignUp={false}
      variation="modal"
      loginMechanism="phone_number"
      loginMechanisms={['phone_number']}
    >
      <App />
    </Authenticator>
  </StrictMode>
)
