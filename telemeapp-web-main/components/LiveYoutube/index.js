import { useContext } from 'react';
import { GlobalContext } from '../../context/GlobalContext';
import styles from '../../styles/components/LiveYoutube.module.css';

export function LiveYoutube() {
    const {
        urlLiveYoutube,
    } = useContext(GlobalContext);

    return (
        <div className={styles.container}>
            <iframe
                className={styles.youtube}
                width="430"
                height="250"
                src={urlLiveYoutube}
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen />
        </div>
    )
}