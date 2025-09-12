import { Workflow } from "@core/types/data";

const initWorkflow = async () => {
    try {
        const res: Workflow = await window.api.createWorkflow({
            name: `Draft - ${Date.now()}`,
        });

        return res ?? null; // si por alguna razón no retorna nada
    } catch (err) {
        console.error("❌ Error creating workflow:", err);
        return null;
    }
};

export {
    initWorkflow
}