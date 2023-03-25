import styles from '../../styles/components/Graph.module.css';
import { ResponsiveContainer } from 'recharts'
import Select from 'react-select';

import { Line, defaults, Chart } from 'react-chartjs-2';
import zoomPlugin from 'chartjs-plugin-zoom';

import { useEffect, useState } from 'react';




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
var colors = ['white', 'yellow', 'grey', 'blue', 'red'];

const stylesSelect = {
    option: (provided, state) => ({
        ...provided,
        fontWeight: state.isSelected ? "bold" : "normal",
        fontSize: state.selectProps.fontSize
    }),

    input: (provided, state) => ({
        ...provided,
        color: 'white',
        fontSize: state.selectProps.fontSize
    }),

    multiValue: (provided, state) => ({
        ...provided,
        color: 'grey',
        fontSize: state.selectProps.fontSize
    }),
};

const chart_options = {
    animation: true,
    // // responsive: false,
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
                    enabled: true,
                },
                mode: "xy",
            },
            pan: {
                enabled: true,
                mode: "xy"
            },
        },
    },
    maintainAspectRatio: false,
};

export default function CompleteGraph(props) {
    const [dadosExibidos, setDadosExibidos] = useState(["current_motor"]);
    var dadosRecebidos = props.data;


    //Adds zoom option to the charts
    useEffect(function mount() {
        Chart.register(zoomPlugin);
    });

    // Pega os valores selecionados no Select e coloca no state
    const handleChangeSelect = (selectedOptions) => {
        setDadosExibidos(selectedOptions?.map(o => o.value));
    }

    const CriaDataset = (dadoASerExibido, index) => {
        var dataset = {
            label: dadoASerExibido,
            backgroundColor: colors[index],
            borderColor: colors[index],
            data: dadosRecebidos.map(function (line) {
                return line[dadoASerExibido]
            }),
        }
        return dataset;
    }

    const data = {
        datasets: dadosExibidos?.map(CriaDataset),
        labels: dadosRecebidos?.map(function (line) {
            return line['time']
        })
    };

    return (
        <div className={styles.container}>
            <ResponsiveContainer width="100%" height="16%">
                <Select
                    options={InfoNames}
                    isMulti={true}
                    closeMenuOnSelect={false}
                    styles={stylesSelect}
                    onChange={handleChangeSelect}
                    defaultValue={{ label: "Corrente Motor", value: "current_motor" }}
                    fontSize='15px'
                    theme={(theme) => ({
                        ...theme,
                        colors: {
                            ...theme.colors,
                            neutral0: '#242466', //Background do select
                            primary25: '#030345', //Background do item selecionado
                        },
                    })}
                />
            </ResponsiveContainer>
            <ResponsiveContainer width="95%" height="80%" className={styles.graph}>
                <Line data={data} options={chart_options} />
            </ResponsiveContainer>
        </div>
    )
}
