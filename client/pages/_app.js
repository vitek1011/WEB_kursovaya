import React from "react";
import App from "next/app";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import withRedux from "next-redux-wrapper";
import { makeStore } from "../redux";
import Navbar from "../components/Navbar";

class MyApp extends App {
  static async getInitialProps({ Component, ctx }) {
    const pageProps = Component.getInitialProps
      ? await Component.getInitialProps(ctx)
      : {};
    return { pageProps };
  }

  render() {
    const { Component, pageProps, store } = this.props;
    return (
      <Provider store={store}>
        <PersistGate persistor={store.__persistor} loading={null}>
          <Navbar />
        </PersistGate>
      </Provider>
    );
  }
}

export default withRedux(makeStore)(MyApp);
