import { useRive } from '@rive-app/react-canvas'

export function FullscreenRive({ onClose }: { onClose: () => void }) {
    const { RiveComponent } = useRive({
        src: `https://static.canva.com/web/riv/ea63eccd3888013bc2e29d27247b8220.riv`,
        stateMachines: 'State Machine 1',
        autoplay: true,
    })

    return (
        <div
            style={{
                position: 'fixed',
                inset: 0,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                overflow: 'hidden',
                zIndex: 1000,
                cursor: 'pointer',
            }}
            onClick={onClose}
        >
            <div className="wDupLw" />
            <RiveComponent
                style={{
                    width: '100vw',
                    height: '100vh',
                    background: 'transparent',
                    zIndex: 10,
                    pointerEvents: 'none',
                }}
            />
        </div>
    )
}
