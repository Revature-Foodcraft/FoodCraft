// MacroCircle.tsx
import React from 'react';
import './MacroTracker.css';

export interface MacroData {
    label: string;
    amount: number;
    goal: number;
}

const MacroCircle: React.FC<MacroData> = ({ label, amount, goal }) => {
    // Calculate progress percentage, clamped to 100%
    const percent = Math.min((amount / goal) * 100, 100);

    // Coordinates and radius in viewBox coordinates (with viewBox "0 0 36 36")
    const cx = 18;
    const cy = 18;
    const r = 15.9155;

    // Compute the angle for the progress (starting at 12 o'clock) by subtracting 90 degrees.
    const angle = (percent / 100) * 360 - 90;
    const rad = (angle * Math.PI) / 180;

    // Add an offset so that the flame sits just outside the arc.
    const offset = 3;
    const flameX = cx + (r + offset) * Math.cos(rad);
    const flameY = cy + (r + offset) * Math.sin(rad);

    return (
        <div className="macro-circle">
            <div className="labelGoal">{amount}/{goal}</div>
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
            <div className="label">{label}</div>
        </div>
    );
};

export default MacroCircle;
