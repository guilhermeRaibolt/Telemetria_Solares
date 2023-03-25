import styles from '../../styles/components/Map.module.css';
import { TileLayer, MapContainer, Marker, Popup, useMapEvents, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { FiCornerUpLeft, FiFlag, FiPlus, FiEye, FiPlayCircle, FiStopCircle, FiUpload, FiDownload } from "react-icons/fi";
import Swal from 'sweetalert2'
import lineColor from './lineColor';
// import positions from './positionsFake';
import { saveAs } from "file-saver";

import 'leaflet/dist/leaflet.css'
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css'
import "leaflet-defaulticon-compatibility";
import { useContext, useEffect, useState } from 'react';
import { GlobalContext } from '../../context/GlobalContext';

let i = 0;
let flags = [];
let voltaAtual = [];
let voltas = [];

const BoatIcon = L.icon({
    iconUrl: './boat.jpeg',
    iconSize: [30, 30], // size of the icon
});

const FlagIcon = L.icon({
    iconUrl: './flag.png',
    iconSize: [30, 30], // size of the icon
});


export default function Map(props) {
    const [posicaoAtual, setPosicaoAtual] = useState([-22.9231845,-43.0955149])
    const [addFlag, setAddFlag] = useState(false);
    const [numVoltas, setNumVoltas] = useState(0);
    const [numVoltaEspecifica, setNumVoltaEspecifica] = useState(-1);
    const [startRecording, setStartRecording] = useState(false)
    const [stopRecording, setStopRecording] = useState(false)

    const {
        bandeiras,
        handleBandeiras,
        gps
    } = useContext(GlobalContext)

    function recordingRoute() {
        if (startRecording === true && stopRecording === false) {
            voltaAtual.push(posicaoAtual);
        }
        else if (startRecording === true && stopRecording === true) {
            voltas.push(voltaAtual);
            let pos = numVoltas;
            pos = pos + 1;
            voltaAtual = [];
            setNumVoltas(pos);
            setStartRecording(false);
            setStopRecording(false);
        }
    }

    // Esse useEffect representa uma simulação do banco de dados
    // Funcionamento: Ele tá pegando uma coordenada "[-20.280080, -40.313748]" de um vetor de coordenadas fake
    //                que eu criei no arquivo positionsFake.js. Essa posição que ele pega é salva na variável
    //                posicaoAtual, usando o setPosicaoAtual. Se for usar o banco de dados real, substituir apenas
    //                a lógica desse useEffect.
    useEffect(() => {

        let posicao_atual = [gps.latitude, gps.longitude];
        
        recordingRoute();
        setPosicaoAtual(posicao_atual);
    
    }, [gps])

    const Markers = () => {
        useMapEvents({
            click(e) {
                if (addFlag === false) {
                    return null;
                }
                flags.push([e.latlng.lat, e.latlng.lng]);
                handleBandeiras(flags);
                setAddFlag(!addFlag);
            },
        })
        return null;
    }


    // Função para adicionar uma bandeira no mapa
    async function addFlagCoords() {
        const { value: formValues } = await Swal.fire({
            title: `Coordenadas`,
            html: `<div class="input-area"> 
                    <div class="input-1">
                        <p class="input-text">Latitude</p> 
                        <input id="swal-input1" class="swal2-input" /> 
                    </div>  
                    <div class="input-2">
                        <p class="input-text">Longitude </p> 
                        <input id="swal-input2" class="swal2-input" /> 
                    </div> 
                </div>`,
            focusConfirm: false,
            width: 600,
            padding: '3em',
            background: '#fff',
            preConfirm: () => {
                return [
                    document.getElementById('swal-input1').value,
                    document.getElementById('swal-input2').value
                ]
            }
        })

        if (formValues) {
            if (formValues[0] !== "" && formValues[1] !== "") {
                flags.push([formValues[0], formValues[1]]);
                handleBandeiras(flags);

                Swal.fire(JSON.stringify(formValues))
            }
        }
    }


    // Mostra a trilha atual do barco
    const BoatRoute = () => {
        return <Polyline pathOptions={lineColor[numVoltas]} positions={voltaAtual} />
    }

    // Mostra as trilhas das voltas selecinadas
    const ShowEspecificRoute = (props) => {
        if (voltas.length > 0) {
            return <Polyline pathOptions={lineColor[props.pos]} positions={voltas[props.pos]} />
        }
        return null;
    }


    async function selectEspecificRoute() {
        let voltasFeitas = []
        voltasFeitas.push("nenhuma")
        for (let i = 1; i <= numVoltas; i++) {
            voltasFeitas.push(i)
        }
        const { value: voltaSelecionada } = await Swal.fire({
            title: 'Selecione a volta que deseja ver',
            input: 'select',
            inputOptions: {
                voltasFeitas
            },
            inputPlaceholder: 'Voltas feitas',
            showCancelButton: true,

        })

        if (voltaSelecionada) {
            if (voltaSelecionada > 0) {
                let pos = voltaSelecionada - 1;
                setNumVoltaEspecifica(pos);
                Swal.fire(`Você selecionou a volta ${voltaSelecionada}`)
            }
            else {
                setNumVoltaEspecifica(-1);
            }
        }
    }

    function handleDownloadData() {
        const jsonObj = JSON.stringify(voltas);
        const blob = new Blob([jsonObj], { type: "application/json" });
        saveAs(blob, "dados-mapa.json");
    };

    function handleFileSelect(event) {
        const reader = new FileReader()
        reader.onload = handleFileLoad;
        reader.readAsText(event.target.files[0])
    }

    function handleFileLoad(event) {
        const result = event.target.result
        const finalObj = JSON.parse(result);
        voltas = finalObj;
        setNumVoltas(finalObj.length);
    }

    function CenterTheMapOnMakerChange({ coords }) {
        const map = useMap();
        map.setView(coords, map.getZoom());
      
        return null;
    }

    return (
        <div className={styles.container} id="map-id" style={{ height: props.containerHeight }}>
            {props.admin &&
                <div className={styles.mapHeader}>
                    <div className={styles.addRoute}>
                        {
                            startRecording === true ?
                                <FiStopCircle
                                    color="#FFFFFF"
                                    size={25}
                                    style={{ fill: 'red' }}
                                    onClick={() => setStopRecording(true)}
                                /> :
                                <FiPlayCircle
                                    color="#FFFFFF"
                                    size={25}
                                    style={{ fill: 'green' }}
                                    onClick={() => setStartRecording(true)}
                                />
                        }

                        <FiEye
                            color="#FFFFFF"
                            size={25}
                            onClick={() => selectEspecificRoute()}
                        />

                        <div>
                            <label htmlFor="arquivo">
                                <FiUpload
                                    color="#FFFFFF"
                                    size={22}
                                    type="file"
                                />
                            </label>
                            <input type="file" name="arquivo" id="arquivo" onChange={handleFileSelect} />
                        </div>

                        <FiDownload
                            color="#FFFFFF"
                            size={22}
                            onClick={() => handleDownloadData()}
                        />
                    </div>

                    <div className={styles.addFlags}>
                        <FiPlus
                            color="#FFFFFF"
                            size={25}
                            onClick={() => addFlagCoords()}
                        />
                        <FiFlag
                            color="#FFFFFF"
                            size={25}
                            style={addFlag ? { fill: 'red' } : {}}
                            onClick={() => setAddFlag(!addFlag)}
                        />
                        {bandeiras.length > 0 &&
                            <FiCornerUpLeft
                                color="#FFFFFF"
                                size={25}
                                onClick={() => {
                                    flags.pop();
                                    handleBandeiras(flags);
                                }}
                            />}
                    </div>
                </div>}

            <MapContainer
                center={posicaoAtual}
                zoom={15}
                style={{ width: '100%', height: props.mapHeight }}
            >
                <TileLayer
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={posicaoAtual} icon={BoatIcon}>
                    <Popup>
                        Poente - Solares <br /> Última atualização: {gps?.time}
                    </Popup>
                </Marker>

                {bandeiras.map((position, idx) =>
                    <Marker key={idx} position={position} icon={FlagIcon}></Marker>
                )}

                <Markers />

                <CenterTheMapOnMakerChange coords={posicaoAtual} />

                {startRecording === true && <BoatRoute />}

                {numVoltaEspecifica !== -1 && <ShowEspecificRoute pos={numVoltaEspecifica} />}

            </MapContainer>
        </div>
    )
}