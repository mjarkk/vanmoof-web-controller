import { ShareDurationSlider } from '../components/ShareDurationSlider'

export default function SliderTest() {
    return (
        <div>
            <ShareDurationSlider onChangeMinutes={console.log} />
            <style jsx>{`
                div {
                    display: flex;
                    align-items: center;
                    flex-direction: column;
                }
            `}</style>
        </div>
    );
}
