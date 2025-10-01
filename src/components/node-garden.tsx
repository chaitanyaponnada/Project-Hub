
"use client";

import { useState, useEffect } from "react";

interface NodeStyle {
    '--size': string;
    '--x': string;
    '--y': string;
    '--duration': string;
    '--delay': string;
}

export const NodeGarden = () => {
    const [styles, setStyles] = useState<NodeStyle[]>([]);

    useEffect(() => {
        // This code now runs only on the client, after the initial render.
        const generateStyles = () => {
            return Array.from({ length: 50 }).map(() => ({
                '--size': `${Math.random() * 5 + 2}px`,
                '--x': `${Math.random() * 100}%`,
                '--y': `${Math.random() * 100}%`,
                '--duration': `${Math.random() * 10 + 10}s`,
                '--delay': `${Math.random() * -10}s`,
            }));
        };
        setStyles(generateStyles());
    }, []);

    // Render nothing on the server, and only render on the client once styles are generated.
    if (styles.length === 0) {
        return null;
    }

    return (
        <div className="absolute inset-0 z-0 overflow-hidden">
            {styles.map((style, i) => (
                <div
                    key={i}
                    className="node"
                    style={style as React.CSSProperties}
                />
            ))}
        </div>
    );
};
