import { useState, useEffect } from "react";
import axios from "axios";
import { createContext } from "react";

export const APIPuppiesContext = createContext()

export function APIPuppiesContextpProvider(props){

 const petData = { 
    id: 1, 
    nombre: "Max",
    raza: "Labrador Retriever",
    birthday: "2019-05-15T00:00:00.000Z", 
    peso: 30.9,
    sexo: "Macho",
    ejercicio: "Moderado"
    };

    const APIPuppiesData = {
        petData
    }
    return(
        <APIPuppiesContext.Provider value={APIPuppiesData}>
            {props.children}
        </APIPuppiesContext.Provider>
    )
}