import styles from '../../styles/components/Graph.module.css';
import { ResponsiveContainer } from 'recharts'
import Select from 'react-select';

import { Line, defaults, Chart } from 'react-chartjs-2';
import zoomPlugin from 'chartjs-plugin-zoom';

import { useEffect, useState } from 'react';


//Adds zoom option to the charts
Chart.register(zoomPlugin);


// Configurações do conteúdo do gráfico
var InfoNames = [
    { value: "current_motor", label: "Corrente Motor" },
    { value: "current_alimentation", label: "Corrente Alim" },
    { value: "voltage_alimentation", label: "Tensão Alim" },
    { value: "current_mppt", label: "Corrente MPPT" },
    { value: "voltage_batteries", label: "Tensão Baterias" },
    { value: "speed", label: "Velocidade" },
    { value: "humidity", label: "Humidade" },
    { value: "temperature", label: "Temperatura" }
];

export default function MiniGraph(props) {
    const dadosExibidos = [props.type];
    var dadosRecebidos = props.data;
    // let valorAtual = dadosRecebidos[dadosRecebidos.length - 1];
    // console.log(valorAtual);

    const [chartOptions, setChartOptions] = useState({
        animation: true,
        borderWidth: 1,
        lineWidth: 0.6,
        elements: {
            point: {
                radius: 1,
                // hitRadius: 0
            }
        },
        plugins: {
            zoom: {
                zoom: {
                    wheel: {
                        enabled: true,
                    },
                    pinch: {
                        enabled: true
                    },
                    mode: 'xy',
                },
                pan: {
                    enabled: true,
                    mode: "xy"
                },
            }
        },
        maintainAspectRatio: false
    });

    const data = {
        datasets: [{
            label: dadosExibidos[0],
            backgroundColor: props.color,
            borderColor: props.color,
            data: dadosRecebidos.map(function (line) {
                return line[dadosExibidos[0]]
            }),
        }],
        labels: dadosRecebidos.map(function (line) {
            return line['time']
        })
    };


    return (
        <div className={styles.miniGraph}>
            {props.value}
            <Line data={data} options={chartOptions} />
        </div>

    )
} 