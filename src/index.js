import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import { ChainId, ThirdwebProvider } from "@thirdweb-dev/react";
import { Buffer } from "buffer";

import App from "./App";

window.Buffer = Buffer;

const activeChainId = ChainId.Rinkeby;

// Finally, wrap App with ThirdwebWeb3Provider.
ReactDOM.render(
  <React.StrictMode>
    <ThirdwebProvider desiredChainId={activeChainId}>
      <App />
    </ThirdwebProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
