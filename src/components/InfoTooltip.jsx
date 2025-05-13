import { useState, useEffect, useRef } from "react";
import InfoIcon from "../assets/info.webp";

function InfoTooltip() {
  const [showTooltip, setShowTooltip] = useState(false);
  const tooltipRef = useRef(null);
  const timeoutRef = useRef(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const toggleTooltip = () => {
    if (isMobile) setShowTooltip((prev) => !prev);
  };

  const handleMouseEnter = () => {
    if (!isMobile) setShowTooltip(true);
  };

  const handleMouseLeave = () => {
    if (!isMobile) setShowTooltip(false);
  };

  // Revisa si cambia el tamaño de pantalla
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Cerrar tooltip al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target)) {
        setShowTooltip(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Cierre automático en móvil
  useEffect(() => {
    if (showTooltip && isMobile) {
      timeoutRef.current = setTimeout(() => {
        setShowTooltip(false);
      }, 5000);
    }
    return () => clearTimeout(timeoutRef.current);
  }, [showTooltip, isMobile]);

  return (
    <div
      className="relative inline-block"
      ref={tooltipRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <img
        src={InfoIcon}
        alt="info"
        className="h-[2rem] w-auto opacity-60 hover:opacity-100 cursor-pointer"
        onClick={toggleTooltip}
      />
      {showTooltip && (
        <div
          className={`absolute z-10 text-sm text-white text-center bg-black px-3 py-2 rounded shadow-lg w-60 ${isMobile
            ? "right-full ml-2 top-1/2 -translate-y-1/2"
            : "bottom-full mb-2 left-1/2 -translate-x-1/2"
            }`}
        >
          Inicio de tarjetas<br />
          Visa: 4<br />
          Amex: 34 y 37<br />
          Mastercard: 51-55 y 2221-2720
        </div>
      )}
    </div>
  );
}

export default InfoTooltip;