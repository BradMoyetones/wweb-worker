import { Handle, useNodeConnections, type HandleProps } from "@xyflow/react";
import { HTMLAttributes } from "react";

type CustomHandleProps = HandleProps &
    Omit<HTMLAttributes<HTMLDivElement>, "id"> & {
        /** Máximo número de conexiones permitidas */
        connectionCount: number;
    };

export const CustomHandle = (props: CustomHandleProps) => {
    const connections = useNodeConnections({
        handleType: props.type,
    });

    return (
        <Handle
            {...props}
            isConnectable={connections.length < props.connectionCount}
        />
    );
};