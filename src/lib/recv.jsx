import mqtt from "mqtt";
import { useEffect } from "react";
import { useCallback } from "react";
import { useContext } from "react";
import { createContext } from "react";

const MQTT = createContext(/** @type {mqtt.MqttClient | null} */ (null));

/**
 * @typedef {object} ComederoData 
 * @prop {number} plato del 0 al 100 gramos
 * @prop {number} tanque distancia en cm
 */

/**
 * Ejecuta el callback cuando recibe un mensaje
 * @param {(data: ComederoData) => void} callback
 * @returns el cliente mqtt
 */
export function useRecv(callback) {
    const client = useContext(MQTT)

    useEffect(() => {
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
    }, [])

    return client
}

/**
 * Provee la conexión a la placa
 */
export function RecvProvider({ children }) {
    const client = mqtt.connect("wss://broker.emqx.io:8084/mqtt", {})
    client.subscribe("utn-frsfco/comedero")

    return (
        <MQTT.Provider value={client}>
            {children}
        </MQTT.Provider>
    )
}