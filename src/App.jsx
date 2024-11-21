import { useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AxiosProvider } from "../src/utils/axios/AxiosProvider";
import ReactQueryProvider from "./context/ReactQueryProvider";
import { HomePage } from './pages/HomePage/HomePage';
import { WaitingRoom } from "./pages/WaitingRoom/WaitingRoom";
import { CustomerQueuePage } from "./pages/CustomerQueuePage/CustomerQueuePage";
import { VideoCallPage } from "./pages/VideoCallPage/VideoCallPage";
import { LoginPage } from './pages/LoginPage/LoginPage';
import { Basics } from './components/VideoCall/Basics';
import { AgentLoginPage } from './pages/AgentLoginPage/AgentLoginPage';
import { VerifierLoginPage } from './pages/VerifierLoginPage/VerifierLoginPage';
import { VerificationQueuePage } from './pages/VerificationQueuePage/VerificationQueuePage';
import { CustomerPage } from './pages/CustomerPage/CustomerPage';
import { CustomerOTPPage } from './pages/CustomerPage/CustomerOTPPage';
import { CustomerDocsPage } from './pages/CustomerPage/CustomerDocsPage';
import { CustomerAadharPage } from './pages/CustomerPage/CustomerAadharPage';
import { StartVideoCallPage } from './pages/CustomerPage/StartVideoCallPage';
import { ConsentPage } from './pages/CustomerPage/ConsentPage';
import { VerifyCustomerPage } from './pages/VerificationQueuePage/VerifyCustomerPage';
import UnauthorizedPage from './pages/UnauthorizedPage/UnauthorizedPage'; // Ensure the correct path
import ProctectedRoute from './pages/ProtectedRoute/ProtectedRoute';
import './index.css';
import { AuthorisedRoute } from './pages/AuthorisedRoute/AuthorisedRoute';
import { CustomerPhoto } from './pages/CustomerPage/CustomerPhoto';

function App() {
  const [count, setCount] = useState(0)

  return (
    <AxiosProvider>
      <ReactQueryProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/home" />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/waitingRoom" element={<WaitingRoom />} />
            <Route path='/customerPage' element={<CustomerPage />} />
            <Route path='/customerOTPPage' element={<CustomerOTPPage />} />
            <Route path='/customerDocsPage' element={<CustomerDocsPage />} />
            <Route path='/customerAadharPage' element={<CustomerAadharPage />} />
            <Route path='/customerPhoto' element={<CustomerPhoto />} />
            <Route path='/startVideoCallPage' element={<StartVideoCallPage />} />
            <Route path='/consentPage' element={<ConsentPage />} />
            <Route path='/videoCallPage/:customerId' element={<VideoCallPage />} />
            <Route path='/Basic' element={<Basics />} />
            <Route path='/agentLogin' element={<AgentLoginPage />} />
            <Route path='/verifierLogin' element={<VerifierLoginPage />} />
            <Route element={<ProctectedRoute />}>
              <Route element={<AuthorisedRoute roles={['Agent']} />}>
                <Route path="/customerQueuePage" element={<CustomerQueuePage />} />
              </Route>
              <Route element={<AuthorisedRoute roles={['Verifier']} />}>
                <Route path="/verificationQueuePage" element={<VerificationQueuePage />} />
                <Route path='/verifyCustomerPage/:customerId' element={<VerifyCustomerPage />} />
              </Route>
            </Route>
            <Route path='/unauthorized' element={<UnauthorizedPage />} />
          </Routes>
        </BrowserRouter>
      </ReactQueryProvider>
    </AxiosProvider>
  )
}

export default App
