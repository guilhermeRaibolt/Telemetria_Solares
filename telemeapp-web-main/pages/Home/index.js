import dynamic from "next/dynamic";
import { Camera } from '../../components/Camera';
import { Header } from '../../components/Header';
import { LiveYoutube } from "../../components/LiveYoutube";
import { Times } from '../../components/Times';
import styles from '../../styles/pages/Home.module.css';

const Map = dynamic(() => import("../../components/Map"), {
    ssr: false
})

export default function Home() {

    return (
        <>
            <Header />
            <div className={styles.container}>
                <div className={styles.topo}>
                    <Camera />
                    <LiveYoutube />
                    <Times />
                </div>
                <div className={styles.mapa}>
                    <Map admin={false} containerHeight={500} mapHeight="100%" />
                </div>
            </div>
        </>
    )
}