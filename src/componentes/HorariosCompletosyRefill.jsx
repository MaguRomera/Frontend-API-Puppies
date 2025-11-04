

export function RoutineWidget({ routine, status }) {
  
  
    if (
        !routine ||
        !Array.isArray(routine.schedule) ||
        routine.schedule.length === 0 ||
        !routine.servingSize
    ) {
        return null;
    }

    const { schedule, servingSize } = routine;
    const portionsPerDay = schedule?.length || 2;
    const capacity = 500; // gramos del tanque

    // formulita q predice cuándo se agota la comida del tanque
    const daysToRefill = Math.floor(capacity / (servingSize * portionsPerDay));

    const formatTime = (minutes) => {
        const h = Math.floor(minutes / 60).toString().padStart(2, "0");
        const m = (minutes % 60).toString().padStart(2, "0");
        return `${h}:${m}`;
    };

    return (
        <div className="tank-card">
        <h3 className="widget-title">Próxima porción</h3>

        <div className="times-row">
            {schedule.map((time, i) => (
            <span
                key={i}
                className={`time-pill ${status?.[i]?.done ? "done" : ""}`}
            >
                {formatTime(time)}
            </span>
            ))}
        </div>

        <p className="refill-label">Recargar tanque en</p>

        <div className="refill-value">
            {daysToRefill} {daysToRefill === 1 ? "día" : "días"}
        </div>

        <div className="alarm-icon">⏰</div>
        </div>
    );
}