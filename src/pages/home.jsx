import { useState, useEffect } from "react";
import EstadoComedero from "../componentes/EstadoComedero";
import { EstadoComida } from "../componentes/EstadoComida";
import BotonMenu from "../componentes/BotónMenu";
import { useRecv } from "../lib/recv";
import { RoutineWidget } from "../componentes/HorariosCompletosyRefill";
import axios from "axios";
import { useAuth } from "../context/authcontext";


export default function Home(){
    
    const { api } = useAuth();

    const [tanque, setTanque] = useState(0);
    const [plato, setPlato] = useState(0);

    const [routine, setRoutine] = useState(null);
    const [status, setStatus] = useState([]);

    const devId = 39;

    useRecv((data) => {
        setTanque(data.tanque)
        setPlato(data.plato)
    })

    const fetchRoutine = async () => {
    try {
      const { data } = await api.get(`/devices/${devId}/routine`);
      setRoutine(data);
    } catch (error) {
      console.error("Error rutina:", error);
    }
  };

    const fetchStatus = async () => {
        try {
        const { data } = await api.get(`/devices/${devId}/routine/status`);
        setStatus(data);
        } catch (error) {
        console.error("Error status:", error);
        }
    };

    useEffect(() => {
        fetchRoutine();
    }, []);

    useEffect(() => {
        if (routine) fetchStatus();
    }, [routine]);

    return(
        <div className="main">
            <header className="flex bg-verydarkgrey h-12 px-4">
                <BotonMenu />
            </header>
            <div className="cnt-main-home">
                <EstadoComida gramos={plato}/>
                <span className="info-tanque">
                    <EstadoComedero value={Math.round((30 - tanque) / 30 * 100 + 5)}/>
                </span>
                <span className="cnt-main-home">
                    <RoutineWidget routine={routine} status={status}/>
                </span>
            </div>
        </div>
    )
}