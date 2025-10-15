import { useContext, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BotonMenu from "../componentes/BotónMenu";
import edit_icon from '../assets/edit.svg';
import delete_icon from '../assets/delete.svg';
import { APIPuppiesContext } from "../context/apipuppiescontext";

export function Mascota() {
    const { petData } = useContext(APIPuppiesContext);
    const navigate = useNavigate();

    const hasPet = petData && petData.nombre;

    const [isEditingPet, setIsEditingPet] = useState(false);
    
    const [nombre, setNombre] = useState(petData.nombre || "");
    const [raza, setRaza] = useState(petData.raza || "");
    const [peso, setPeso] = useState(petData.peso || "");
    const [sexo, setSexo] = useState(petData.sexo || "Macho"); 
    const [ejercicio, setEjercicio] = useState(petData.ejercicio || "Bajo");
    const [birthDate, setBirthDate] = useState(
        petData.birthday ? new Date(petData.birthday) : null
    );
    
    const [breeds, setBreeds] = useState([]); 
    const [isLoadingBreeds, setIsLoadingBreeds] = useState(false);

    const exerciseOptions = ["Bajo", "Moderado", "Alto"];

    // Sincroniza los estados locales al montar o si petData cambia
    useEffect(() => {
        setNombre(petData.nombre || "");
        setRaza(petData.raza || "");
        setPeso(petData.peso || "");
        setSexo(petData.sexo || "Macho");
        setEjercicio(petData.ejercicio || "Bajo");
        setBirthDate(petData.birthday ? new Date(petData.birthday) : null);
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
                setBreeds([{ id: 0, name: petData.raza }]); 
            } finally {
                setIsLoadingBreeds(false);
            }
        };
        fetchBreeds();
    }, [petData.raza]); 


    const handleEdit = () => {
        setIsEditingPet(true);
    };

    const handleCancel = () => {
        // Al cancelar, restauramos los estados locales a los valores originales de petData
        setNombre(petData.nombre || "");
        setRaza(petData.raza || "");
        setPeso(petData.peso || "");
        setSexo(petData.sexo || "Macho");
        setEjercicio(petData.ejercicio || "Bajo");
        setBirthDate(petData.birthday ? new Date(petData.birthday) : null);
        
        setIsEditingPet(false);
    };

    const handleLoadPet = () => {
        navigate('/cargar-mascota'); 
    };

    const handleSave = async () => {
        // CAMBISAR TODO ESSTO POR EL POST DE LA API!!!!
        const selectedBreed = breeds.find(b => b.name === raza);
        const updatedData = {
            name: nombre,
            img: petData.img || '',
            birthday: birthDate ? birthDate.toISOString() : null,
            weight: parseFloat(peso), 
            sex: sexo === 'Macho' ? 'm' : 'f', 
            exercise: exerciseOptions.indexOf(ejercicio),
            breedId: selectedBreed ? selectedBreed.id : 0,
            ownerId: petData.ownerId || 1 
        };
        
        const options = {
            method: 'POST', 
            url: 'https://apipuppies.santiagocezar2013.workers.dev/api/pets/',
            headers: {'Content-Type': 'application/json'},
            data: updatedData
        };

        try {
            await axios.request(options);
            setIsEditingPet(false);
        } catch (error) {
            console.error("Error al guardar la mascota:", error);
            alert("Error al guardar los datos.");
        }
    };
    
    const formattedBirthDate = birthDate ? birthDate.toISOString().substring(0, 10) : '';

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
                        <p className="datolargo">{petData.nombre}</p>
                    )}
                </span>
                
                {/* Raza */}
                <span className="mascota-dato">
                    <label>Raza</label>
                    {isEditingPet ? (
                        <select
                            value={raza}
                            onChange={(e) => setRaza(e.target.value)}
                            className="datolargo editable-input"
                            disabled={isLoadingBreeds}
                        >
                            {isLoadingBreeds && <option>Cargando razas...</option>}
                            {breeds.map((breed) => (
                                <option key={breed.id} value={breed.name}>{breed.name}</option>
                            ))}
                        </select>
                    ) : (
                        <p className="datolargo">{petData.raza}</p>
                    )}
                </span>
                
                <span className="mascota-info-agrupador">
                    {/* Día de nacimiento */}
                    <span className="mascota-dato">
                        <label>Nació el día...</label>
                        {isEditingPet ? (
                            <input 
                                type="date"
                                value={formattedBirthDate} 
                                onChange={(e) => setBirthDate(e.target.value ? new Date(e.target.value) : null)}
                                className="datocorto editable-input" 
                            />
                        ) : (
                            <p className="datocorto">
                                {birthDate ? birthDate.toLocaleDateString('es-ES') : 'N/A'}
                            </p>
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
                            <p className="datocorto">{petData.peso} kg</p>
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
                                <option value="Macho">Macho</option>
                                <option value="Hembra">Hembra</option>
                            </select>
                        ) : (
                            <p className="datocorto">{petData.sexo}</p>
                        )}
                    </span>
                    
                    {/* Ejercicio */}
                    <span className="mascota-dato">
                        <label>Ejercicio</label>
                        {isEditingPet ? (
                            <select
                                value={ejercicio}
                                onChange={(e) => setEjercicio(e.target.value)}
                                className="datocorto editable-input" 
                            >
                                {exerciseOptions.map(option => (
                                    <option key={option} value={option}>{option}</option>
                                ))}
                            </select>
                        ) : (
                            <p className="datocorto">{petData.ejercicio}</p>
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