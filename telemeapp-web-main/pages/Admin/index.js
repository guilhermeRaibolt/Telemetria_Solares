import { Header } from "../../components/Header";
import dynamic from "next/dynamic";
import {
    FiPlay,
    FiPause,
    FiSquare,
    FiPlus,
    FiMinus,
    FiDownload,
    FiSettings,
    FiLogOut,
    FiAlertTriangle,
    FiPower
} from "react-icons/fi";
import styles from '../../styles/pages/Admin.module.css';
import { useContext, useEffect, useState } from "react";
import { GlobalContext } from "../../context/GlobalContext";
import Swal from 'sweetalert2'
import { useSession, signIn, signOut } from "next-auth/client"
import { Results } from '../../components/Results';
import { Times } from '../../components/Times';
import socket from "../../services/socketio";
import { Camera } from "../../components/Camera";

const Map = dynamic(() => import("../../components/Map"), {
    ssr: false
})

const CompleteGraph = dynamic(() => import("../../components/Graph"), {
    ssr: false
})

const MiniGraph = dynamic(() => import("../../components/MiniGraph"), {
    ssr: false
});

let vectorData = []
let vectorDataMini = []

export default function Admin() {
    const {
        handleVoltaAtual,
        iniciarTempo,
        pausarTempo,
        pararTempo,
        statusTempo,
        baixarDados,
        voltasTotais,
        distanciaTotal,
        handleInputsConfig,
        urlLiveYoutube,
        gps,
    } = useContext(GlobalContext)

    const [session] = useSession();

    const [startSend, setStartSend] = useState(false);
    const [info, setInfo] = useState({});
    const [gpsVector, setGpsVector] = useState([]);

    useEffect(() => {
        socket.on('info', (data) => {
            vectorData.push(data);
            //pega as ultimas 60 posições do vectorData e salva no vectorDataMini
            if (vectorData.length > 60) {
                vectorDataMini = vectorData.slice(vectorData.length - 60, vectorData.length)
            }
            else {
                vectorDataMini = vectorData
            }
            // console.log(vectorDataMini);
            setInfo(data);
        });

        socket.on('allinfo', (data) => {
            vectorData = data;
        });

        socket.on('startSend', (status) => {
            setStartSend(status);
        })
    }, [])

    useEffect(() => {
        setGpsVector(gpsVector.concat(gps));
    }, [gps])

    function getSpeed(speed) {
        let speed_ = 0
        isNaN(speed) ? speed_ = 0 : speed_ = speed
        return parseFloat(speed_) * 1.94384
    }

    function configuration() {
        Swal.fire({
            title: 'Configurações',
            html:
                '<div class="swal2-content-custom">' +
                '<div class="swal2-input-container">' +
                '<label>Voltas totais: </label>' +
                `<input id="swal-input1" value=${voltasTotais}  class="swal2-input" autofocus>` +
                '<label>Distância (mi):</label>' +
                `<input id="swal-input2" value=${distanciaTotal} class="swal2-input" autofocus>` +
                '<label>Link Live YT:</label>' +
                `<input id="swal-input3" value=${urlLiveYoutube} class="swal2-input" autofocus>` +
                '</div>' +
                '</div>',
            focusConfirm: false,
            preConfirm: () => {
                return [
                    document.getElementById('swal-input1').value,
                    document.getElementById('swal-input2').value,
                    document.getElementById('swal-input3').value,
                ]
            }
        }).then((result) => {
            if (result.value) {
                handleInputsConfig(result.value[0], result.value[1])
                socket.emit('newUrlLiveYoutube', result.value[2])

                Swal.fire(
                    'Configurações salvas!',
                    '',
                    'success'
                )
            }
        }
        )
    }

    function clearAll() {
        Swal.fire({
            title: 'Deseja realmente limpar todos os dados?',
            text: "Você não poderá reverter isso!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sim, limpar!',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.value) {
                socket.emit('limparDados');
                Swal.fire(
                    'Dados limpos!',
                    '',
                    'success'
                )
            }
        })
    }

    function handleStartSend() {
        socket.emit("startSend", !startSend);
        setStartSend(!startSend);
    }

    const superUsers = [
        "estevaons.gt@gmail.com",
        "giselle18sp@gmail.com",
        "andreoliveiracunha20@gmail.com",
        "fernandorr1108@gmail.com",
    ]
    function isSuperUser(email) {
        return superUsers.includes(email)
    }

    if (session) {
        return (
            <div className={styles.container}>
                <Header />
                {
                    isSuperUser(session?.user?.email) &&
                    <>
                        <div className={styles.dangerArea}>
                            <button onClick={clearAll}>
                                <FiAlertTriangle size={30} color="#FFFFFF" />
                            </button>
                            <button onClick={handleStartSend}>
                                <FiPower size={40} color={startSend ? "red" : "yellow"} />
                            </button>
                            <button onClick={signOut}>
                                <FiLogOut size={30} color="#FFFFFF" />
                            </button>
                        </div>
                        <div className={styles.control}>
                            <div className={styles.singleControl}>
                                <h1>Relógio</h1>
                                <div className={styles.singleControlIcons}>
                                    {statusTempo ?
                                        <div>
                                            <FiPause size={50} color="#FFF" className={styles.icon} onClick={() => pausarTempo()} />
                                            <FiSquare size={50} color="#FFF" className={styles.icon} onClick={() => pararTempo()} />
                                        </div>
                                        :
                                        <FiPlay size={50} color="#FFF" className={styles.icon} onClick={() => iniciarTempo()} />
                                    }
                                </div>
                            </div>
                            <div className={styles.singleControl}>
                                <h1>Volta</h1>
                                <div className={styles.singleControlIcons}>
                                    <FiPlus size={50} color="#FFF" className={styles.icon} onClick={() => handleVoltaAtual('plus')} />
                                    <FiMinus size={50} color="#FFF" className={styles.icon} onClick={() => handleVoltaAtual('')} />
                                </div>
                            </div>
                            <div className={styles.singleControl}>
                                <h1>Baixar Dados</h1>
                                <FiDownload size={50} color="#FFF" className={styles.icon} onClick={() => baixarDados()} />
                            </div>

                            <div className={styles.singleControl}>
                                <h1>Config.</h1>
                                <FiSettings size={50} color="#FFF" className={styles.icon} onClick={() => configuration()} />
                            </div>
                        </div>
                    </>
                }
                <div className={styles.map}>
                    <Map admin={isSuperUser(session?.user?.email)} containerHeight={400} mapHeight="95%" />
                    <div style={{ paddingRight: 10, paddingLeft: 10 }}>
                        <Camera />
                    </div>
                </div>

                <div className={styles.meio}>
                    <MiniGraph type="current_motor" color="#fff" data={vectorDataMini} value={info?.current_motor} />
                    <MiniGraph type="voltage_batteries" color="#59F5E9" data={vectorDataMini} value={info?.voltage_batteries} />
                    <MiniGraph type="speed" color="#E630E2" data={gpsVector} value={getSpeed(gps?.speed).toFixed(3)} />
                    <MiniGraph type="temperature" color="#FF8405" data={vectorDataMini} value={info?.temperature} />
                    <MiniGraph type="voltage_alimentation" color="#59F5E9" data={vectorDataMini} value={info?.voltage_alimentation} />
                    <MiniGraph type="humidity" color="#59F5E9" data={vectorDataMini} value={info?.humidity} />
                    <MiniGraph type="current_mppt" color="#00ff00" data={vectorDataMini} value={info?.current_mppt} />
                </div>

                <div className={styles.fim}>
                    <CompleteGraph data={vectorDataMini} />
                    <Times />
                    <Results />
                </div>
            </div>
        )
    }
    else {
        return (
            <div className={styles.containerButton}>
                <div className={styles.buttonLogin} onClick={() => signIn('google')}>
                    <img
                        src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/1200px-Google_%22G%22_Logo.svg.png"
                        alt="Google Logo"
                        height="30px"
                    />
                    Entrar com o Google
                </div>
            </div>
        )
    }
}