import EstadoComedero from "../componentes/EstadoComedero";
import { EstadoComida } from "../componentes/EstadoComida";

export default function Home(){
    return(
        <div className="cnt-main-home">
            <EstadoComida/>
            <span className="info-tanque">
                <EstadoComedero/>
            </span>
        </div>
    )
}