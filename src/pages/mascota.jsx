import { useContext, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BotonMenu from "../componentes/BotónMenu";
import edit_icon from '../assets/edit.svg';
import delete_icon from '../assets/delete.svg';
import { useAuth } from "../context/authcontext";

export function Mascota() {

    const {api} = useAuth();
    const navigate = useNavigate();

    const [petData, setPetData] = useState(null);

    const hasPet = petData

    const [isEditingPet, setIsEditingPet] = useState(false);
    
    const [nombre, setNombre] = useState("");
    const [petId, setPetId] = useState(0);
    const [razaId, setRazaId] = useState(0);
    const [peso, setPeso] = useState("");
    const [sexo, setSexo] = useState(""); 
    const [ejercicio, setEjercicio] = useState(0);
    const [birthDate, setBirthDate] = useState("");
    
    const [breeds, setBreeds] = useState([]); 
    const [isLoadingBreeds, setIsLoadingBreeds] = useState(false);

    const exerciseOptions = [
    { value: 0, label: "Bajo" },
    { value: 1, label: "Moderado" },
    { value: 2, label: "Alto" },
    ];
    const getPetData = async ()=> {
        const options = {
                method: 'GET',
                url: 'https://apipuppies.santiagocezar2013.workers.dev/api/pets/'            
            };
            try {
                const { data } = await api.request(options);
                setPetData(data[0] || null);
                console.log(data)
            } catch (error) {
                console.error("Error al traer las mascotas:", error); 
            } 
    }
    
    useEffect(() => {
        getPetData()

    }, []);

    // Sincroniza los estados locales al montar o si petData cambia
    useEffect(() => {
        if (!petData) return;
        
        setPetId(petData.id);
        setNombre(petData.name);
        setRazaId(petData.breedId);
        setPeso(petData.weight);
        setSexo(petData.sex);
        setEjercicio(petData.exercise);
        setBirthDate(
            petData.birthday ? petData.birthday.substring(0, 10) : ""
        );
    }, [petData]);

    // useEffect para cargar la lista de razas
    useEffect(() => {
        const fetchBreeds = async () => {
            setIsLoadingBreeds(true);
            const options = {
                method: 'GET',
                url: 'https://apipuppies.santiagocezar2013.workers.dev/api/breeds/'
            };
            try {
                const { data } = await axios.request(options);
                setBreeds(data);
            } catch (error) {
                console.error("Error al cargar razas:", error); 
            } finally {
                setIsLoadingBreeds(false);
            }
        };
        fetchBreeds();
    }, []); 


    const handleEdit = () => {
        setIsEditingPet(true);
    };

    const handleCancel = () => {
        // Al cancelar, restauramos los estados locales a los valores originales de petData
        setIsEditingPet(false);
        setNombre(petData.name);
        setRazaId(petData.breedId);
        setPeso(petData.weight);
        setSexo(petData.sex);
        setEjercicio(petData.exercise);
        setBirthDate(petData.birthday ? petData.birthday.substring(0, 10) : "");       
    };

    const handleLoadPet = () => {
        navigate('/cargar-mascota'); 
    };

    const handleSave = async () => {
        try {

            const birthdayToSend = birthDate instanceof Date
                ? birthDate.toISOString().split("T")[0]
                : birthDate;
            const body = {
                name: nombre,
                birthday: birthDate,
                weight: parseFloat(peso),
                sex: sexo,
                exercise: Number(ejercicio),
                breedId: Number(razaId),
            };

            const res = await api.patch(
                `https://apipuppies.santiagocezar2013.workers.dev/api/pets/${petId}`,
                body,
                { headers: { "Content-Type": "application/json" } }
            );

            setPetData(res.data);
            setIsEditingPet(false);

        } catch (err) {
            console.error("Error guardando mascota:", err);
        }
    };
        

    
    const formattedBirthDate = birthDate ? birthDate.toString().substring(0, 10) : '';

    // Modo NO HAY MASCOTA
    if (!hasPet) {
        return (
            <div className="mascota-main-div no-pet-page">
                <header className="flex bg-verydarkgrey h-12 px-4 absolute top-0 left-0 w-full">
                    <BotonMenu />
                </header>
                <div className="no-pet-message-cnt">
                    <h2 className="no-pet-title">¡Oops!</h2>
                    <p className="no-pet-text">Parece que no tienes mascotas cargadas.</p>
                    <button 
                        onClick={handleLoadPet} 
                        className="btn-cargar-mascota"
                    >
                        Cargar Mascota
                    </button>
                </div>
            </div>
        );
    }

    // Modo HAY MASCOTA y Edición
    return (
        <div className="mascota-main-div">
            <header className="flex bg-verydarkgrey h-12 px-4">
                <BotonMenu />
            </header> 
            <div className="title-mascota-cnt">
                <h2>TU MASCOTA</h2>
                <span className="btn-mascota-cnt">
                    {/* Botón de editar mascota */}
                    {!isEditingPet && (
                        <button onClick={handleEdit}>
                            <img src={edit_icon} title="Editar mascota"/>
                        </button>
                    )}
                    {/* Botón de eliminar mascota*/}
                    {!isEditingPet && (
                        <button>
                            <img src={delete_icon} title="Eliminar mascota"/>
                        </button>
                    )}
                </span>
            </div>
            <section className="mascota-data-cnt">
                
                {/* Nombre */}
                <span className="mascota-dato">
                    <label>Nombre</label>
                    {isEditingPet ? (
                        <input
                            type="text"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            className="datolargo editable-input" 
                        />
                    ) : (
                        <p className="datolargo">{nombre}</p>
                    )}
                </span>
                
                {/* Raza */}
                <span className="mascota-dato">
                    <label>Raza</label>
                    {isEditingPet ? (
                        <select
                            value={razaId}
                            onChange={(e) => setRazaId(parseInt(e.target.value))}
                            className="datolargo editable-input"
                            disabled={isLoadingBreeds}
                        >
                            {isLoadingBreeds && <option>Cargando razas...</option>}
                            {breeds.map((breed) => (
                                <option key={breed.id} value={breed.id}>{breed.name}</option>
                            ))}
                        </select>
                    ) : (
                        <p className="datolargo">{breeds.find((b) => b.id === Number(razaId))?.name || ""}</p>
                    )}
                </span>
                
                <span className="mascota-info-agrupador">
                    {/* Día de nacimiento */}
                    <span className="mascota-dato">
                        <label>Nació el día...</label>
                        {isEditingPet ? (
                            <input 
                                type="date"
                                value={birthDate} 
                                onChange={(e) => setBirthDate(e.target.value)}
                                className="datocorto editable-input" 
                            />
                        ) : (
                            <p className="datocorto">{birthDate}</p>
                        )}
                    </span>

                    {/* Peso */}
                    <span className="mascota-dato">
                        <label>Peso</label>
                        {isEditingPet ? (
                            <input
                                type="number"
                                step="0.1" 
                                value={peso}
                                onChange={(e) => setPeso(e.target.value)}
                                className="datocorto editable-input" 
                            />
                        ) : (
                            <p className="datocorto">{peso} kg</p>
                        )}
                    </span>
                </span>
                
                <span className="mascota-info-agrupador">
                    {/* Sexo */}
                    <span className="mascota-dato">
                        <label>Sexo</label>
                        {isEditingPet ? (
                            <select
                                value={sexo}
                                onChange={(e) => setSexo(e.target.value)}
                                className="datocorto editable-input" 
                            >
                                <option value="m">Macho</option>
                                <option value="f">Hembra</option>
                            </select>
                        ) : (
                            <p className="datocorto">{sexo === "m" ? "Macho" : "Hembra"}</p>
                        )}
                    </span>
                    
                    {/* Ejercicio */}
                    <span className="mascota-dato">
                        <label>Ejercicio</label>
                        {isEditingPet ? (
                            <select
                                value={ejercicio}
                                onChange={(e) => setEjercicio(parseInt(e.target.value))}
                                className="datocorto editable-input" 
                            >
                                {exerciseOptions.map(option => (
                                    <option key={option.value} value={option.value}>{option.label}</option>
                                ))}
                            </select>
                        ) : (
                            <p className="datocorto">{exerciseOptions.find(opt => opt.value === ejercicio)?.label}</p>
                        )}
                    </span>
                </span>
                
                {isEditingPet && (
                    <>
                        <div className="btn-actions-group"> 
                            <button onClick={handleSave} className="btn-guardar-mascota">
                                GUARDAR DATOS
                            </button>
                            <button onClick={handleCancel} className="btn-cancelar-mascota">
                                CANCELAR
                            </button>
                        </div>
                    </>
                )}
            </section>
        </div>
    );
}