
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
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        if (isClient) {
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
        }
    }, [isClient]);

    if (!isClient) {
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
