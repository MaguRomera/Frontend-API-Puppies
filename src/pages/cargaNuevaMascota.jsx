import { useContext, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import BotonMenu from "../componentes/BotónMenu";
import { APIPuppiesContext } from "../context/apipuppiescontext";

export function cargaNuevaMascota(){

    const { petData } = useContext(APIPuppiesContext);
    const navigate = useNavigate();

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
    const formattedBirthDate = birthDate ? birthDate.toISOString().substring(0, 10) : '';

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

    const handleCancel = () => {
        navigate('/mascota')
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

    return(
        <div className="mascota-main-div">
            <header className="flex bg-verydarkgrey h-12 px-4">
                <BotonMenu />
            </header>
            <div className="title-carga-masc">
                <h2>CARGAR MASCOTA</h2>
            </div>
            
            <section className="mascota-data-cnt">
                {/* Nombre */}
                <span className="mascota-dato">
                    <label>Nombre</label>
                        <input
                            type="text"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            className="datolargo editable-input" 
                        />
                </span>
                {/* Raza */}
                <span className="mascota-dato">
                    <label>Raza</label>
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
                </span>
                
                <span className="mascota-info-agrupador">
                    {/* Día de nacimiento */}
                    <span className="mascota-dato">
                        <label>Nació el día...</label>
                            <input 
                                type="date"
                                value={formattedBirthDate} 
                                onChange={(e) => setBirthDate(e.target.value ? new Date(e.target.value) : null)}
                                className="datocorto editable-input" 
                            />
                    </span>

                    {/* Peso */}
                    <span className="mascota-dato">
                        <label>Peso</label>
                            <input
                                type="number"
                                step="0.1" 
                                value={peso}
                                onChange={(e) => setPeso(e.target.value)}
                                className="datocorto editable-input" 
                            />
                    </span>
                </span>
                
                <span className="mascota-info-agrupador">
                    {/* Sexo */}
                    <span className="mascota-dato">
                        <label>Sexo</label>
                            <select
                                value={sexo}
                                onChange={(e) => setSexo(e.target.value)}
                                className="datocorto editable-input" 
                            >
                                <option value="Macho">Macho</option>
                                <option value="Hembra">Hembra</option>
                            </select>
                    </span>
                    
                    {/* Ejercicio */}
                    <span className="mascota-dato">
                        <label>Ejercicio</label>
                            <select
                                value={ejercicio}
                                onChange={(e) => setEjercicio(e.target.value)}
                                className="datocorto editable-input" 
                            >
                                {exerciseOptions.map(option => (
                                    <option key={option} value={option}>{option}</option>
                                ))}
                            </select>
                    </span>
                </span>
                

                <div className="btn-actions-group"> 
                    <button onClick={handleSave} className="btn-guardar-mascota">
                        GUARDAR DATOS
                    </button>
                    <button onClick={handleCancel} className="btn-cancelar-mascota">
                        CANCELAR
                    </button>
                </div>
            </section>
        </div>
    )
}