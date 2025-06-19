import ClubSVG from '../../../club.svg';
import BallSVG from '../../../ball.svg';

export default function Loader() {
    return (
        <div className="h-screen grid place-items-center">
            <div className="relative w-fit mx-auto mb-8">
                <ClubSVG className="club fill-brand-blue w-48 h-fit"/>
                <BallSVG className="ball fill-white w-6 h-fit absolute right-3 bottom-3"/>
            </div>
            <p className="text-2xl text-center">Loading...</p>
        </div>
    )
}