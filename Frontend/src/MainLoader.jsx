import ShinyText from "../reactBitsComponents/ShinyText/ShinyText";



export default function MainLoader() {
    return (
        <div className="loading-screen">
            <ShinyText
                text="Verifying session..."
                disabled={false}
                speed={3}
                className="custom-class"
            />

            <div className="loading-warning">
                ⚠️ Initial load may take 30–40 seconds.
                Backend is hosted on Render (cold start).

            </div>
        </div>
    )
}