import weight from "../assets/weight.svg"
import datetime from "../assets/date-time.svg"
import notification from "../assets/notification on.svg"
import BotonMenu from "../componentes/BotónMenu"
import ToggleSwitch from "../componentes/SwitchToggle"
import { useState } from "react"

export function Preferencias(){

    const [notifEstadoMascota, setNotifEstadoMascota] = useState(true);
    const [notifEstadoComedero, setNotifEstadoComedero] = useState(true);

    return(
        <div className="main">
            <header className="flex bg-verydarkgrey h-12 px-4">
                <BotonMenu />
            </header>
            <div className="main-pref-cnt">
                <span className="ajuste-cnt">
                    <span className="info-ajuste-cnt">
                        <img src={weight}/>
                        <label>Unidad del peso</label>
                    </span>
                    <select className="selector-pref"  name="Unidad">
                        <option value="Kilogramos">Kilogramos (Kg)</option>
                        <option value="Gramos">Gramos (g)</option>
                        <option value="Libras">Libras (lb)</option>
                    </select>
                </span>
                <span className="ajuste-cnt">
                    <span className="info-ajuste-cnt">
                        <img src={datetime}/>
                        <label>Unidad de la edad</label>
                    </span>
                    <select className="selector-pref"  name="Unidad">
                        <option value="Meses">Meses</option>
                        <option value="Años">Años</option>
                    </select>
                </span>
                <span className="notif-cnt">
                    <span className="info-ajuste-cnt">
                        <img src={notification}/>
                        <label>Notificaciones de la app</label>
                    </span>
                    <span className="config-noti">
                        <label>Estado de mascota</label>
                        <ToggleSwitch
                            checked={notifEstadoMascota}
                            onChange={(val) => setNotifEstadoMascota(val)}
                        />
                    </span>
                    <span className="config-noti">
                        <label>Estado del comedero</label>
                        <ToggleSwitch
                            checked={notifEstadoComedero}
                            onChange={(val) => setNotifEstadoComedero(val)}
                        />
                    </span> 
                </span>
            </div>
        </div>
    )
}