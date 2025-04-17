// MacroCircle.tsx
import React from 'react';
import '../../css/MacroTracker.css';
import 'bootstrap/dist/css/bootstrap.min.css';


export interface MacroData {
    label: string;
    amount: number;
    goal: number;
}

const MacroCircle: React.FC<MacroData> = ({ label, amount, goal }) => {
    // Calculate progress percentage, clamped to 100%
    const percent = isNaN(amount / goal) ? 0 : Math.min((amount / goal) * 100, 100);

    // Coordinates and radius in viewBox coordinates (with viewBox "0 0 36 36")
    const cx = 18;
    const cy = 18;
    const r = 15.9155;

    // Compute the angle for the progress (starting at 12 o'clock) by subtracting 90 degrees.
    const angle = (percent / 100) * 360 - 90;
    const rad = isNaN(angle) ? 0 : (angle * Math.PI) / 180;

    // Add an offset so that the flame sits just outside the arc.
    const offset = 3;
    const flameX = isNaN(cx + (r + offset) * Math.cos(rad)) ? cx : cx + (r + offset) * Math.cos(rad);
    const flameY = isNaN(cy + (r + offset) * Math.sin(rad)) ? cy : cy + (r + offset) * Math.sin(rad);

    // Removed all labels except one
    return (
        <div className="macro-circle">
            <svg viewBox="0 0 36 36" className="macro-svg">
                {/* Background circle */}
                <circle className="bg" cx={cx} cy={cy} r={r} />
                {/* Progress arc: rotate the arc by -90° so that it starts at the top */}
                <g transform="rotate(-90 18 18)">
                    <circle
                        className="progress"
                        cx={cx}
                        cy={cy}
                        r={r}
                        strokeDasharray={`${percent} 100`}
                    />
                </g>
                {/* Center percentage text (remains upright) */}
                <text x="18" y="20.35" className="percentage">
                    {`${Math.round(percent)}%`}
                </text>
                {/* Flame icon at the end of the progress arc */}
                <text
                    x={flameX}
                    y={flameY}
                    className="flame"
                    dominantBaseline="middle"
                    textAnchor="middle"
                >
                    🔥
                </text>
            </svg>
            <div className="macro-circle-amount mt-4">{amount}/{goal}</div>
            <div className="macro-circle-label">{label}</div>
        </div>
    );
};

export default MacroCircle;
