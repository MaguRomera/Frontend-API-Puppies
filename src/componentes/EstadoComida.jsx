import '../App.css'
export function EstadoComida({ gramos = 10}){

    const nombrePerro = "Max";
    const comio = gramos <= 5;
    const fondoClase = comio ? 'bg-green' : 'bg-yellow';

    return(
        <div className={`flex flex-col items-start gap-2 w-90 h-24 rounded-lg p-4 shadow-md ${fondoClase}`}>
            <h5 className="text-md font-semibold text-darkgrey font-sans">ÚLTIMA COMIDA</h5>
            <span className="text-xl font-semibold text-darkgrey font-sans">
                {nombrePerro} {comio ? "está satisfecho!" : "no comió su comida"}
            </span>
        </div>
    )
}