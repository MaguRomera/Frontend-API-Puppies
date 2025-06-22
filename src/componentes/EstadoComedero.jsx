import '../App.css'

const EstadoComedero = ({ value = 25 }) => {
  
  
  const clampedValue = Math.min(100, Math.max(0, value));

  return (
    <div className="flex flex-col items-center gap-2 w-fit">
      <div className="w-10 h-30                                                                                                        rounded-lg overflow-hidden relative border"
            style={{ backgroundColor: '#DF59C2', borderColor: '#aaaaaa' }}
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