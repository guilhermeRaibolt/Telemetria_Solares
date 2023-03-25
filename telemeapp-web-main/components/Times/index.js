import { useContext } from 'react';
import { GlobalContext } from '../../context/GlobalContext';
import styles from '../../styles/components/Times.module.css';

export function Times(props) {
  const {
    temposVoltas,
    formatNumber
  } = useContext(GlobalContext)

  return (
    <div className={styles.container}>
      <h1>Tempos de volta</h1>

      <div className={styles.times}>
        { temposVoltas.map((tempo, index) => (
          index == 0 ? 
          <p key={index}> {index + 1} - {formatNumber(tempo)}</p>
          :
          <p key={index}> {index + 1} - {formatNumber(tempo - temposVoltas[index - 1])}</p>
        )) }
      </div>
    </div>
  )
}