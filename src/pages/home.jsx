import { useState } from "react";
import EstadoComedero from "../componentes/EstadoComedero";
import { EstadoComida } from "../componentes/EstadoComida";
import BotonMenu from "../componentes/BotónMenu";
import { useRecv } from "../lib/recv";


export default function Home(){
    const [tanque, setTanque] = useState(0);
    const [plato, setPlato] = useState(0);

    useRecv((data) => {
        setTanque(data.tanque)
        setPlato(data.plato)
    })

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
            </div>
        </div>
    )
}