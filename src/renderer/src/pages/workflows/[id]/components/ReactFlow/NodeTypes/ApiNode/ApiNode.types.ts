export interface ApiConfig {
    method: string
    url: string
    headers: Record<string, string>
    authorization: {
        type: string
        token?: string
        username?: string
        password?: string
    }
    body: {
        type: string
        content: string
        formData?: Record<string, string>
    }
    preRequestScript: string
    tests: string
    settings: {
        httpVersion: string
        sslVerification: boolean
        followRedirects: boolean
        followOriginalMethod: boolean
        followAuthHeader: boolean
        removeRefererHeader: boolean
        strictHttpParser: boolean
        encodeUrlAutomatically: boolean
        disableCookieJar: boolean
        useServerCipherSuite: boolean
        maxRedirects: number
        disabledTlsProtocols: string[]
    }
}

export type WorkflowNodeData = {
    label: string
    type: string
    config?: ApiConfig // sólo los nodos tipo "api" lo tendrán
}
