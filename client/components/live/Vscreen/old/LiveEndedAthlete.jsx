import { useEffect, useState } from "react"

function LiveEndedAthlete({ athleteData }) {
    const [color, setColor] =  useState('#transparent')
    const [leftReady, setLeftReady] = useState('-100%')
    const [fontColor, setFontColor] = useState('white')

    useEffect(() => {
        if (athleteData.dynamic) {
            switch (athleteData.dynamic.CurrentRank) {
                case 1:
                    setColor('#ffbf00')
                    setFontColor('black')
                    break
                case 2:
                    setColor('#c6316e')
                    setFontColor('black')
                    break
                case 3:
                    setColor('#31b9c6')
                    setFontColor('black')
                    break
                default:
                    setColor('transparent')
                    setFontColor('white')
                    break
            }
        }
    }, [athleteData])

    return <div className="liveresult w-100 d-flex justify-content-start align-items-center px-2 h2 my-0 py-2 border default-font display-6 fw-bold" style={{ backgroundColor: color, color: fontColor }}>
        <div className="live-standing-lane me-4">{athleteData.dynamic.CurrentRank}</div>
        <div className="live-standing-name text-wrap me-auto lh-1">{athleteData.static.displayName.slice(0,25).toUpperCase()}</div>
        <div className="live-ended-result">{athleteData.dynamic.result && athleteData.dynamic.result.includes('CAP') ? athleteData.dynamic.result : athleteData.dynamic.result.slice(3)}</div>
    </div>
}

export default LiveEndedAthlete