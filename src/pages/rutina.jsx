import BotonMenu from "../componentes/BotónMenu"
import { useState, useEffect } from "react";
import { useAuth } from "../context/authcontext";


export function rutina(){

    const { api, user } = useAuth();
    const devId = 39;
    const utcOffset = -10800;
    const forPetId = 0;

    const[goal, setGoal] = useState("")
    const objetiveOptions = ["Mantener peso", "Disminuir peso", "Aumentar peso"];
    const [servingSize, setServingSize] = useState(0)
    const cantComidasOPC = [2, 3]
    const [cantComidas, setCantComidas] = useState(2)


    //temita schedule
    const [horarios, setHorarios] = useState(["08:00", "20:00"]);
    const [errorHorario, setErrorHorario] = useState("");
    const [schedule, setSchedule] = useState([]) //acá le guardo los segundos

    const convertToSeconds = (time) => {
        const [h, m] = time.split(":").map(Number);
        return h * 3600 + m * 60;
    };

    const getRoutine = async () => {
        try {
            const { data } = await api.get(
                `https://apipuppies.santiagocezar2013.workers.dev/api/devices/${devId}/routine`
            );

            if (!data) return; // si no hay rutina cargada, chau
            if (data.goal) setGoal(data.goal === "increase" ? "Aumentar peso" : data.goal === "decrease" ? "Disminuir peso" : "Mantener peso");
            if (data.servingSize) setServingSize(data.servingSize);
            if (data.schedule?.length > 0) {
                setCantComidas(data.schedule.length);
                setHorarios(data.schedule.map(seg => {
                    const h = Math.floor(seg / 3600).toString().padStart(2,"0");
                    const m = Math.floor((seg % 3600) / 60).toString().padStart(2,"0");
                    return `${h}:${m}`;
                }));
            }

        } catch (err) {
            console.error("Error obteniendo rutina:", err);
        }
    };

    useEffect(() => {
        getRoutine();
    }, []);

    useEffect(() => {
        if (Number(cantComidas) === 2) {
            setHorarios(["08:00", "20:00"]);
        } else {
            setHorarios(["08:00", "13:00", "20:00"]);
        }
    }, [cantComidas]);

    useEffect(() => {
        const secondsArray = horarios.map(h => convertToSeconds(h));
        setSchedule(secondsArray);
    }, [horarios]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const scheduleSeconds = horarios.map(t => timeToSeconds(t));

        const payload = {
            goal: goal === "Aumentar peso" ? "increase" : goal === "Disminuir peso" ? "decrease" : "maintain",
            servingSize: Number(servingSize),
            schedule: scheduleSeconds,
            utcOffset,
            forPetId
        };

        try {
            await api.put(
                `https://apipuppies.santiagocezar2013.workers.dev/api/devices/${devId}/routine`,
                payload
            );
            console.log("Rutina guardada con éxito");
        } catch (err) {
            console.error("Error guardando rutina:", err);
        }
    };

    const handleHorarioChange = (index, value) => {
        const updated = [...horarios];
        updated[index] = value;

        // Validar horarios repetidos !!
        const unique = new Set(updated);
        if (unique.size !== updated.length) {
            setErrorHorario("Error: Los horarios no pueden repetirse");
        } else {
            setErrorHorario("");
        }

        setHorarios(updated);
    };

    return(
        <div className="main">
            <header className="flex bg-verydarkgrey h-12 px-4">
                <BotonMenu />
            </header>
            <div className="cnt-main-rutina">
                <form onSubmit={handleSubmit}>
                    <span className="campo">
                        <label>Objetivo nutricional</label>
                        <select
                                value={goal}
                                onChange={(e) => setGoal(e.target.value)}
                                className="datocorto editable-input" 
                                required
                            >
                                {objetiveOptions.map(option => (
                                    <option key={option} value={option}>{option}</option>
                                ))}
                            </select>
                            
                    </span>
                    <span className="campo">
                        <label>Cantidad de comidas diarias</label>
                        <select
                                value={cantComidas}
                                onChange={(e) => setCantComidas(e.target.value)}
                                className="datocorto editable-input" 
                                required
                            >
                                {cantComidasOPC.map(option => (
                                    <option key={option} value={option}>{option}</option>
                                ))}
                            </select>
                    </span>
                    <span className="campo">
                        <label>Cantidad por comida (gr)</label>
                        <input 
                            className="datocorto editable-input"
                            value={servingSize}
                            onChange={(e) => setServingSize(e.target.value)}
                            type="number" 
                            max={200}
                            min={20}
                            required
                        />
                    </span>
                    <span className="campo">
                        <label>Ajustar horarios</label>
                        <div className="horarios-container">
                            {horarios.map((hora, index) => (
                                <div key={index}>
                                    <input 
                                        type="time"
                                        value={hora}
                                        className="input-horario"
                                        onChange={(e) => handleHorarioChange(index, e.target.value)}
                                    />
                                </div>
                            ))}
                        </div>
                        {errorHorario && (
                            <p className="error-horario">{errorHorario}</p>
                        )}
                    </span>
                    <button type="submit" className="btn-guardar-mascota">
                        Guardar rutina
                    </button>
                </form>
            </div>
        </div>
    )
}