type ApiConfig = {
    url: string
    method: "GET" | "POST" | "PUT" | "DELETE"
    headers: Record<string, string>
    queryParams: Record<string, string>
    body: {
        type: "none" | "form-data" | "x-www-form-urlencoded" | "raw" | "binary"
        rawMode?: "json" | "javascript" | "text" | "html" | "xml"
        content?: string
    }
    settings: {
        httpVersion: "1.0" | "1.1" | "2.0"
        verifySSL: boolean
        followRedirects: boolean
        maxRedirects: number
    }
}

type WorkflowNodeData = {
    label: string
    type: string
    config?: ApiConfig // sólo los nodos tipo "api" lo tendrán
}
