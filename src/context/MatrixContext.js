import React, { useState, useEffect } from "react";
import * as sdk from "matrix-js-sdk";

export const MatrixContext = React.createContext();

export const MatrixContextProvider = (props) => {
  const [client, setClient] = useState();

  const initClient = async () => {
    const userInfo = {
      accessToken: process.env.REACT_APP_MATRIX_ACCESS_TOKEN,
      deviceId: process.env.REACT_APP_DEVICE_ID,
      baseUrl: process.env.REACT_APP_BASE_URL,
      userId: process.env.REACT_APP_USER_ID,
    };

    const matrixClient = sdk.createClient(userInfo);

    await matrixClient.startClient();

    matrixClient.once("sync", async (state, prevState, res) => {
      // state will be 'PREPARED' when the client is ready to use
      setClient(matrixClient);
    });
  };

  useEffect(() => {
    initClient();
  }, []);

  return (
    <MatrixContext.Provider
      value={{
        client,
      }}
    >
      {props.children}
    </MatrixContext.Provider>
  );
};

export default { MatrixContextProvider };
