import { useContext } from 'react';
import { GlobalContext } from '../../context/GlobalContext';
import styles from '../../styles/components/Results.module.css';


export function Results() {
  const {
    tempo,
    calculaTempoRestanteVolta,
    calculaTempoRestanteCorrida,
    calculaVelocidadeMedia,
} = useContext(GlobalContext);

    return(
        <div className={styles.container}>
          <h1>Estimativas</h1>
          <div className={styles.results}>
            <p>Tempo Restante de Volta <br/> <span>{calculaTempoRestanteVolta(tempo)}</span></p>
            <p>Tempo Restante de Corrida <br/> <span>{calculaTempoRestanteCorrida(tempo)}</span></p>
            <p>Velocidade Média <br/> <span>{calculaVelocidadeMedia(tempo)*3600} nós</span></p>
          </div>
        </div>
    )
  }