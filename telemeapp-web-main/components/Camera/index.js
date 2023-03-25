import styles from '../../styles/components/Camera.module.css';
import useWebSocket from 'react-use-websocket';
import { useEffect, useState } from 'react';

export function Camera(){
    const [imgUrl, setImgUrl] = useState(null);
    const [protocolStr, setProtocolStr] = useState("wss");
	
    useEffect(() => {
        const protocol = window.location.protocol === "https:" ? "wss" : "ws";
        setProtocolStr(protocol);
    },[])

    const { lastJsonMessage, sendMessage } = useWebSocket(protocolStr+'://' +'camera-esp32.herokuapp.com/jpgstream_client', {
        onOpen: () => console.log(`Connected to App WS (server camera)`),
        onMessage: (message) => {
            var url = URL.createObjectURL(message.data);
            setImgUrl(url);
        },
        onError: (event) => { console.error(event); },
        shouldReconnect: (closeEvent) => true,
        reconnectInterval: 3000
    });

    return(
        <div className={styles.container}>
            <img 
                // src="logo_sol.png"
                // src="https://img.ibxk.com.br/2016/10/04/04184843355196.gif"
                src={imgUrl ? imgUrl : "https://www.blogderocha.com.br/wp-content/uploads/2017/02/fora-do-ar.gif"}
                alt="Logo Solares"
                // width="90%"
                // height="90%"
                height="250px"
                width="250px"
            />
        </div>
    )
}