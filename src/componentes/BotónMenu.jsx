import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
//imágenes de íconos
import menuicon from "../assets/menu.svg"
import reloj from "../assets/alarm-clock.svg"
import home from "../assets/home.svg"
import patita from "../assets/paw.svg"
import config from "../assets/account-setting.svg"
import logoutIcon from "../assets/logout.svg"

import { useAuth } from "../context/authcontext"

export default function BotonMenu() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();
  const handleNavigate = (path) => {
    setOpen(false);
    navigate(path);
  }

  const handleLogout = () => {
    setOpen(false);
    logout(); 
  }

  return (
    <>

      <button className="menu-toggle" onClick={() => setOpen(true)}>
        <img src={menuicon} title="Desplegar menú"/>
      </button>

      {open && <div className="overlay" onClick={() => setOpen(false)} />}

      <div className={`sidebar ${open ? "open" : ""}`}>

        <div className="prinp-funcs">
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
        
        <div className="logout-cnt">
          <span onClick={handleLogout} className="menu-item logout">
            <img src={logoutIcon} alt="Cerrar Sesión" className="menu-icon" />
           Cerrar Sesión
          </span>
        </div>

      </div>
    </>
  );
}