import Greeting from "@/components/Greeting";

export default function Home() {
    return (
        <div
            id="playlist-container"
            className="relative transition-all duration-1000 rounded-lg"
        >
            <div className="relative z-10 px-6 pt-10 pb-6">
                <Greeting />
                
                <div
                    className="absolute top-0 left-0 right-0 h-[80vh] bg-gradient-to-b from-primary via-primary/50  -z-[1]"
                >
                </div>
            </div>
        </div>
    )
}
