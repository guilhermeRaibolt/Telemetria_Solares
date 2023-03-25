import { InfoProvider } from '../context/GlobalContext'
import '../styles/globals.css'

function MyApp({ Component, pageProps }) {

  return (
    <InfoProvider>
      <Component {...pageProps} /> 
    </InfoProvider>
    
  )
}

export default MyApp
