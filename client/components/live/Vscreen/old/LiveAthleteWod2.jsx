import { useEffect, useState } from "react"
import { useRounds } from "../functions/hooks"
import "../statics/css/LiveAthlete.css"

function LiveAthleteWod2({ data }) {
    const [color, setColor] = useState('#c6316eb4')
    const [bgColor, setBgColor] = useState('')
    const [colors, setColors] = useState([])
    const [borders, setBorders] = useState('')
    const [textColor, setTextColor] = useState('')
    const roundsReps = useRounds(data)

    // const colors = ['#c6316eb4', '#c28605', '#3902a0', '#023b0f', '#191919']
    const colorOdd = '#747474'
    const colorEven = '#c0c0c0'
    const colorsOdd = ['#232323', '#414141', '#686868', '#858585', '#b6b6b6']
    const colorsEven = ['#232323', '#414141', '#686868', '#858585', '#b6b6b6']
    const colorsFirst = ['#3b2c00', '#765800', '#b18400', '#ebb000', '#ffc927']
    const colorsSecond = ['#481228', '#681a3a', '#972554', '#cf3c78', '#da6b99']
    const colorsThird = ['#0e3538', '#124348', '#1a6168', '#258d97', '#6bd1da']
    const textColorDefault = '#c0c0c0'

    function heightPosition(data, index = -1) {
        const score = data.dynamic.score_abs
        let size
        if (index < 0) {
            size = score / data.wod.total_reps * 100
        } else {
            let repsUntilIndex = 0
            // let reps = Object.values(data.dynamic.Log_mvt_time[0])
            let reps = roundsReps
            for (let i = 0; i <= index; i++) {
                repsUntilIndex += reps[i] * 1
            }
            size = repsUntilIndex / data.wod.total_reps * 100
        }

        return Math.min(Math.round(size * 100) / 100, 100)
    }

    useEffect(() => {
        if (!data.dynamic) {
            return
        }
        
        if (data.dynamic.result) {
            switch (data.dynamic.CurrentRank) {
                case 1:
                    setBgColor('linear-gradient(to top, #ffc51a50, #ffc51a 30% 70%, #ffc51a50')
                    setBorders('1px solid #ffbf00')
                    break;
                case 2:
                    setBgColor('linear-gradient(to top, #c6316e50, #c6316e 30% 70%, #c6316e50')
                    setBorders('1px solid #e6e6e6')
                    break
                case 3:
                    setBgColor('linear-gradient(to top, #31b9c650, #31b9c6 30% 70%, #31b9c650')
                    setBorders('1px solid #d9bd6e')
                    break
                default:
                    // if (data.dynamic.lane % 2 == 0) {
                    //     setBgColor('linear-gradient(to top, #31b9c650, #31b9c6 30% 70%, #31b9c650')
                    // } else {
                    //     setBgColor('linear-gradient(to top, #c6316e50, #c6316e 30% 70%, #c6316e50')
                    // }
                    setBgColor('linear-gradient(to top, #9a9a9a50, #9a9a9a 30% 70%, #9a9a9a50')
                    setBorders('1px solid #c0c0c0')
                    break;
            }
            setColors([])
        } else {
            setBgColor('')
        }
        switch (data.dynamic.CurrentRank) {
            case 1:
                setColor('#ffbf00')
                setTextColor('#ffbf00')
                setColors(colorsFirst)
                break
            case 2:
                setColor('#c6316e')
                setTextColor('#c6316e')
                setColors(colorsSecond)
                break
            case 3:
                setColor('#31b9c6')
                setTextColor('#31b9c6')
                setColors(colorsThird)
                break
            default:
                if (data.dynamic.lane % 2 == 0) {
                    setColor(colorEven)
                    setColors(colorsEven)
                } else {
                    setColor(colorOdd)
                    setColors(colorsOdd)
                }
                setTextColor(textColorDefault)
                break
        }
        // calculateRounds(data)
    }, [data])

    if (!data.dynamic || !data.wod) {
        return <div className='liveathletezone w-100 d-flex flex-column justify-content-end' style={{ background: bgColor, border: borders }}></div>
    }

    return <div className='liveathletezone w-100 d-flex flex-column justify-content-end' style={{ background: bgColor, border: borders }}>

        <div className="live-result">{data.dynamic.result && data.dynamic.result.includes('CAP') ? data.dynamic.result : data.dynamic.result.slice(3)}</div>

        <div className='progress-zone h-100 mx-1 d-flex flex-column justify-content-end'>
            {/* {data && !data.dynamic.result && Object.values(data.dynamic.Log_mvt_time[0]).map((m, i) =>{ */}
            {data && !data.dynamic.result && roundsReps.map((m, i) => {
                return <div className="roundbox justify-content-center align-items-center d-inline align-middle d-flex " style={{
                    top: 100 - heightPosition(data, i) + '%',
                    backgroundColor: colors[i],
                    height: m / data.wod.total_reps * 100 - 0.8 + '%'
                }}>
                    <div className="roundbox-content my-auto align-middle small"><em>{m}</em></div>
                </div>
            })}
            <div className="base-wod2 justify-content-center align-items-center d-inline align-middle" style={{ bottom: heightPosition(data) + '%', backgroundColor: color }}>
                <div className="base-content-top align-middle text-center w-100" style={{ color: textColor }}>#{data.static.lane}</div>
                {/* <div className="base-content-round align-middle">{data.dynamic.result ? data.dynamic.CurrentRank : data.dynamic.CurrentRank === 1 ? data.dynamic.score_abs : data.dynamic.score_rel}</div> */}
                {data.dynamic.result && <div className="base-content-round align-middle" style={{
                    width: '80%',
                    background: '#ffffff80',
                    color: 'black',
                    top: '125px',
                    borderRadius: '25px 8px 25px 8px',
                    border: "1px solid white"
                }}>{data.dynamic.CurrentRank}
                </div>}
                {!data.dynamic.result && <div className="base-content-round align-middle" style={{ color: textColor }} >{data.dynamic.CurrentRank === 1 ? <div dangerouslySetInnerHTML={{ __html: '&bigstar;' }} ></div> : data.dynamic.score_rel}</div>}
            </div>
        </div>
        {/* <div className="livelane" style={{ backgroundColor: color }}>{data.static.lane}</div> */}

        {/* <div>{data.dynamic.score_abs}</div>
        <div>{data.wod.total_reps}</div> */}
    </div>
}

export default LiveAthleteWod2