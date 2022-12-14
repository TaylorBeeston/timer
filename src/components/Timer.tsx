import React, { useState, useEffect, useRef } from 'react';
import Alarm from '../assets/audio/BassAlarm.wav';

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
    const [playAlarm, setPlayAlarm] = useState(false);
    const [mute, setMute] = useState(false);

    const timer = useRef<number | undefined>();

    const reset = (playAlarm = false) => {
        if (typeof timer.current === 'number') clearTimeout(timer.current);
        setIsCountingDown(false);
        setTimeRemaining(time);
        setPlayAlarm(playAlarm);
    };
    const start = () => {
        setPlayAlarm(false);
        setIsCountingDown(!isCountingDown);
    };

    const incrementTime = () => setTime(oldTime => oldTime + 1);
    const decrementTime = () => setTime(oldTime => Math.max(oldTime - 1, 1));

    useEffect(() => {
        setTimeRemaining(time);
    }, [time]);

    useEffect(() => {
        if (isCountingDown) {
            if (timeRemaining === 0) return reset(true);

            timer.current = setTimeout(() => setTimeRemaining(oldTime => oldTime - 1), 1000);
        }
    }, [timeRemaining, isCountingDown]);

    return (
        <section>
            {!mute && playAlarm && <audio autoPlay src={Alarm}></audio>}
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

                    if (e.key === 'ArrowUp') incrementTime();
                    if (e.key === 'ArrowDown') decrementTime();
                }}
                onWheel={e => {
                    if (time !== timeRemaining) return;

                    if (e.deltaY < 0) incrementTime();
                    if (e.deltaY > 0) decrementTime();
                }}
            />
            <section className="flex justify-between items-center">
                <button
                    className={`border rounded ${
                        isCountingDown ? 'bg-red-200' : 'bg-green-200'
                    } py-2 px-8`}
                    type="button"
                    onClick={start}
                >
                    {isCountingDown ? 'Stop' : 'Start'}
                </button>
                <label>
                    <input
                        className="mr-1"
                        type="checkbox"
                        value={mute}
                        onChange={() => setMute(!mute)}
                    />
                    Mute
                </label>
                <button
                    className="border rounded bg-blue-200 py-2 px-8"
                    type="button"
                    onClick={() => reset()}
                >
                    Reset
                </button>
            </section>
        </section>
    );
};

export default Timer;
