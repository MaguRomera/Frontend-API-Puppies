import '../App.css'

const EstadoComedero = ({ value = 25 }) => {
  
  
  const clampedValue = Math.min(100, Math.max(0, value));

  return (
    <div className="flex flex-col items-center gap-2 w-24 p-4 border-1 border-lightgrey rounded-lg mt-2">
        <h5 className="text-md font-semibold text-lightgrey font-sans">ESTADO TANQUE</h5>
      <div className="w-16 h-25                                                                                                        rounded-lg overflow-hidden relative border"
            style={{ backgroundColor: '#DF59C2', border: 'none' }}
        >
        <div
          className="absolute flex justify-center bottom-0 left-0 w-full transition-all duration-500 ease-in-out"
          style={{
            height: `${clampedValue}%`,
            backgroundColor: '#69DF59'
          }}
        >
            <span className="text-sm font-bold text-darkgrey font-sans">{clampedValue}%</span>
        </div>
      </div>
      
    </div>
  );
};

export default EstadoComedero;