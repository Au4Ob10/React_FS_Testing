// pages/_app.js
import { ChakraProvider } from "@chakra-ui/react";
import ReactDOM from 'react-dom/client'; // Updated import
import Page from './page';

function MyApp({ Component, pageProps }) {

  const root = ReactDOM.createRoot(document.getElementById('root'));

  root.render
  return (
    <ChakraProvider>
      <Component {...pageProps} />
    </ChakraProvider>
  );
}

export default MyApp;
