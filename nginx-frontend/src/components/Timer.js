import { useEffect, useState } from 'react'


export default function Timer(props) {
    const [seconds, setSeconds] = useState(props.initSeconds)

    const format_time = (timeInSeconds) => {
        const minutes = Math.floor(timeInSeconds / 60).toString().padStart(2, "0")
        const seconds = (timeInSeconds % 60).toString().padStart(2, "0")

        return `${minutes}:${seconds}`
    }

    useEffect(() => {
        props.setTimerIsRun(true)

        if (seconds <= 0) {
            props.setTimerIsRun(false)
            props.setLoginRetries(0)
            return
        }

        const timer = setInterval(() => {
            setSeconds((prevSeconds) => prevSeconds - 1)
        }, 1000)

        return () => clearInterval(timer)
    }, [seconds])

    return format_time(seconds)
}
