import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Panel, useReactFlow, useStoreApi, useViewport, ViewportHelperFunctionOptions } from '@xyflow/react'
import { Minus, Plus, Scan } from 'lucide-react';

export function Controls() {
    const store = useStoreApi();
    const { zoomIn, zoomOut, setCenter, setViewport } = useReactFlow();
    const { zoom, x, y } = useViewport();

    const focusNode = () => {
        const { nodeLookup } = store.getState();
        const nodes = Array.from(nodeLookup).map(([, node]) => node);

        if (nodes.length > 0) {
            const node = nodes[0];

            const cx = node.position.x + (node.measured.width || 0) / 2;
            const cy = node.position.y + (node.measured.height || 0) / 2;
            const z = 1.85;

            setCenter(cx, cy, { zoom: z, duration: 1000 });
        }
    };

    const handleSliderChange = ([newZoom]: number[], options?: ViewportHelperFunctionOptions) => {
        const width = store.getState().width ?? window.innerWidth;
        const height = store.getState().height ?? window.innerHeight;

        // centro de la pantalla en píxeles
        const screenCenterX = width / 2;
        const screenCenterY = height / 2;

        // centro actual del viewport en coordenadas del "mundo"
        const worldCenterX = (screenCenterX - x) / zoom;
        const worldCenterY = (screenCenterY - y) / zoom;

        // nuevo offset para mantener el centro en su sitio
        const newX = screenCenterX - worldCenterX * newZoom;
        const newY = screenCenterY - worldCenterY * newZoom;

        setViewport(
            { x: newX, y: newY, zoom: newZoom },
            { duration: options?.duration || 40, interpolate: 'smooth' }
        );
    };

    
    return (
        <Panel position="bottom-left">
            <div className="p-2 flex gap-2 items-center border rounded-md bg-background shadow-lg">
                <Button
                    onClick={() =>
                        zoomOut({ duration: 200, interpolate: 'smooth' })
                    }
                    variant="ghost"
                    size="icon"
                >
                    <Minus />
                </Button>
                <Slider
                    value={[zoom]}
                    min={0.5}
                    max={2}
                    step={0.1}
                    className="w-40"
                    onValueChange={handleSliderChange}
                />
                <Button
                    onClick={() =>
                        zoomIn({ duration: 200, interpolate: 'smooth' })
                    }
                    variant="ghost"
                    size="icon"
                >
                    <Plus />
                </Button>
                <Button
                    onClick={() => handleSliderChange([1], {duration: 700})}
                    variant="ghost"
                >
                    {Math.trunc(zoom * 100)}%
                </Button>
                <Button
                    onClick={focusNode}
                    variant="ghost"
                    size="icon"
                >
                    <Scan />
                </Button>
            </div>
        </Panel>
    );
}
