import React, { useState, useEffect, useRef } from 'react';

const displayTime = (time: number) => {
    return `${Math.floor(time / 3600)
        .toString()
        .padStart(2, '0')}:${Math.floor((time / 60) % 3600)
        .toString()
        .padStart(2, '0')}:${(time % 60).toString().padStart(2, '0')}`;
};

const displayToTime = (display: string) => {
    const [hours, minutes, seconds] = display.split(':');

    return parseInt(hours) * 3600 + parseInt(minutes) * 60 + parseInt(seconds);
};

const getBgColorClass = (timeRemaining: number) => {
    if (timeRemaining > 45) return 'bg-green-50';

    if (timeRemaining > 30) return 'bg-yellow-50';

    if (timeRemaining > 10) return 'bg-orange-50';

    if (timeRemaining > 5) return 'bg-red-50';
    if (timeRemaining > 4) return 'bg-red-100';
    if (timeRemaining > 3) return 'bg-red-200';
    if (timeRemaining > 2) return 'bg-red-300';
    if (timeRemaining > 1) return 'bg-red-400';

    return 'bg-red-500';
};

const Timer: React.FC = () => {
    const [time, setTime] = useState(60);
    const [timeRemaining, setTimeRemaining] = useState(60);
    const [isCountingDown, setIsCountingDown] = useState(false);

    const timer = useRef<number | undefined>();

    useEffect(() => {
        setTimeRemaining(time);
    }, [time]);

    useEffect(() => {
        if (isCountingDown) {
            if (timeRemaining === 0) {
                setIsCountingDown(false);
                setTimeRemaining(time);
                return;
            }

            timer.current = setTimeout(() => setTimeRemaining(oldTime => oldTime - 1), 1000);
        }
    }, [timeRemaining, isCountingDown]);

    return (
        <section>
            <input
                className={`p-4 text-2xl mb-4 ${
                    isCountingDown ? getBgColorClass(timeRemaining) : ''
                }`}
                value={displayTime(timeRemaining)}
                onChange={e => {
                    if (time !== timeRemaining) return;

                    const newTime = e.target.value;

                    if (newTime.split(':').length !== 2) return;

                    setTime(displayToTime(newTime));
                }}
                onKeyDown={e => {
                    if (time !== timeRemaining) return;

                    if (e.key === 'ArrowUp') setTime(oldTime => oldTime + 1);
                    if (e.key === 'ArrowDown') setTime(oldTime => oldTime - 1);
                }}
                onWheel={e => {
                    if (time !== timeRemaining) return;

                    if (e.deltaY < 0) setTime(oldTime => oldTime + 1);
                    if (e.deltaY > 0) setTime(oldTime => oldTime - 1);
                }}
            />
            <section className="flex justify-between">
                <button
                    className={`border rounded ${
                        isCountingDown ? 'bg-red-200' : 'bg-green-200'
                    } py-2 px-8`}
                    type="button"
                    onClick={() => setIsCountingDown(!isCountingDown)}
                >
                    {isCountingDown ? 'Stop' : 'Start'}
                </button>
                <button
                    className="border rounded bg-blue-200 py-2 px-8"
                    type="button"
                    onClick={() => {
                        if (typeof timer.current === 'number') clearTimeout(timer.current);
                        setIsCountingDown(false);
                        setTimeRemaining(time);
                    }}
                >
                    Reset
                </button>
            </section>
        </section>
    );
};

export default Timer;
