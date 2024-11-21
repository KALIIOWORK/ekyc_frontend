import React, { StrictMode } from 'react';
import { createRoot } from "react-dom/client";
import AgoraRTC, { AgoraRTCProvider } from "agora-rtc-react";
import App from "./App";
import { Provider } from 'react-redux'
import store from './context/state/store.js'
import { LoaderProvider } from './context/LoadingContext.jsx'

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

// In video call, set mode to "rtc"
const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });

const roomFull = () => {
  leave();
  document.getElementById("remote").classList.add("full");
};

const leave = () => {
  // Logic to leave the call
  console.log("Leaving the call");
};

client.on("user-published", async (user, mediaType) => {
  if (client._users.length > 2) {
    roomFull();
  }
  // Rest of the code
});

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <LoaderProvider>
        <AgoraRTCProvider client={client}>
          <App />
        </AgoraRTCProvider>
      </LoaderProvider>
    </Provider>
  </React.StrictMode>
);
