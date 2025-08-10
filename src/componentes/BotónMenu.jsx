import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
//imágenes de íconos
import menuicon from "../assets/menu.svg"
import reloj from "../assets/alarm-clock.svg"
import home from "../assets/home.svg"
import patita from "../assets/paw.svg"
import config from "../assets/account-setting.svg"

export default function BotonMenu() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const handleNavigate = (path) => {
    setOpen(false);
    navigate(path);
  };

  return (
    <>
      {/* Botón para abrir el menú */}
      <button className="menu-toggle" onClick={() => setOpen(true)}>
        <img src={menuicon} title="Desplegar menú"/>
      </button>

      {/* Overlay para opacar y quitar menú*/}
      {open && <div className="overlay" onClick={() => setOpen(false)} />}

      {/* Barrita menú */}
      <div className={`sidebar ${open ? "open" : ""}`}>
        <span onClick={() => handleNavigate("/")} className="menu-item">
          <img src={home} alt="home" className="menu-icon" />
          Home
        </span>
        <div className="divider" />
        <span onClick={() => handleNavigate("/preferencias")} className="menu-item">
          <img src={config} alt="preferencias" className="menu-icon" />
          Preferencias
        </span>
        <div className="divider" />
        <span onClick={() => handleNavigate("/rutina")} className="menu-item">
          <img src={reloj} alt="rutina" className="menu-icon" />
          Rutina
        </span>
        <div className="divider" />
        <span onClick={() => handleNavigate("/mascota")} className="menu-item">
          <img src={patita} alt="mascota" className="menu-icon" />
          Mascota
        </span>
      </div>
    </>
  );
}