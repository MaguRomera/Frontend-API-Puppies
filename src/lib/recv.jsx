import mqtt from "mqtt";
import { useEffect, useContext, createContext, useState } from "react";
import { useAuth } from '../context/authcontext'; 
const MQTT = createContext(/** @type {mqtt.MqttClient | null} */ (null));

/**
 * @typedef {object} ComederoData 
 * @prop {number} plato del 0 al 100 gramos
 * @prop {number} tanque distancia en cm
 */

/**
 * Ejecuta el callback cuando recibe un mensaje.
 * @param {(data: ComederoData) => void} callback
 * @returns el cliente mqtt
 */
export function useRecv(callback) {
    const client = useContext(MQTT)

    useEffect(() => {
        
        if (!client) {
             return; 
        }

        /** @type {mqtt.OnMessageCallback} */
        const parseMessage = (topic, payload) => {
            const dec = new TextDecoder()
            try {
                const obj = JSON.parse(dec.decode(payload))
                callback(obj)
            } catch (err) {
                if (!(err instanceof SyntaxError)) throw err
            }
        };

        client.on("message", parseMessage)
        return () => {
            client.off("message", parseMessage)
        }
    }, [client, callback]) 

    return client
}


function MqttConnector({ children }) {
    const { isLoggedIn } = useAuth();
    const [client, setClient] = useState(null);
    
    useEffect(() => {
        let newClient = null;
        
        if (isLoggedIn) {
            
            const token = localStorage.getItem('accessToken');
            
            const connectionOptions = {
                password: token, 
                clean: true
            };
            
            newClient = mqtt.connect("wss://broker.emqx.io:8084/mqtt", connectionOptions);
            
            newClient.on('connect', () => {
                newClient.subscribe("utn-frsfco/comedero");
            });

            newClient.on('error', (err) => {
                console.error("Error en la conexión MQTT:", err);
            });

            setClient(newClient);
        } else {

            if (client) {
                client.end(true);
                setClient(null);
            }
        }

        return () => {
            if (newClient) {
                newClient.end(true);
            }
        };
    }, [isLoggedIn]); 
    
    return (
        <MQTT.Provider value={client}>
            {children}
        </MQTT.Provider>
    );
}

/**
 * Provee la conexión a la placa (usa MqttConnector para el control de autenticación)
 */
export function RecvProvider({ children }) {
    return <MqttConnector>{children}</MqttConnector>;
}