"use client"

import { useState } from "react"
import { Position, type NodeProps } from "@xyflow/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Zap, Settings, Play, Code, TestTube, X } from "lucide-react"
import { CustomHandle } from "../../CustomHandle"
import { ApiConfig } from "./ApiNode.types"



export function ApiNode({ data, selected }: NodeProps & {data: Record<string, any>}) {
    const [isExpanded, setIsExpanded] = useState(false)
    const [config, setConfig] = useState<ApiConfig>({
        method: "GET",
        url: "",
        headers: {},
        authorization: { type: "none" },
        body: { type: "none", content: "" },
        preRequestScript: "",
        tests: "",
        settings: {
            httpVersion: "HTTP/1.1",
            sslVerification: true,
            followRedirects: true,
            followOriginalMethod: false,
            followAuthHeader: false,
            removeRefererHeader: false,
            strictHttpParser: false,
            encodeUrlAutomatically: true,
            disableCookieJar: false,
            useServerCipherSuite: false,
            maxRedirects: 10,
            disabledTlsProtocols: [],
        },
    })

    const [newHeaderKey, setNewHeaderKey] = useState("")
    const [newHeaderValue, setNewHeaderValue] = useState("")

    const executeRequest = () => {
        console.log("[v0] API Node Configuration:", JSON.stringify(config, null, 2))
    }

    const addHeader = () => {
        if (newHeaderKey && newHeaderValue) {
            setConfig((prev) => ({
                ...prev,
                headers: { ...prev.headers, [newHeaderKey]: newHeaderValue },
            }))
            setNewHeaderKey("")
            setNewHeaderValue("")
        }
    }

    const removeHeader = (key: string) => {
        setConfig((prev) => ({
            ...prev,
            headers: Object.fromEntries(Object.entries(prev.headers).filter(([k]) => k !== key)),
        }))
    }

    if (!isExpanded) {
        return (
            <Card className={`min-w-[200px] p-0 ${selected ? "ring-2 ring-primary" : ""}`}>
                <CardContent className="p-3">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-md bg-orange-500 flex items-center justify-center">
                            <Zap className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1">
                            <CardTitle className="text-sm">{data.label}</CardTitle>
                            <Badge variant="outline" className="text-xs mt-1">
                                {config.method}
                            </Badge>
                        </div>
                        <Button size="sm" variant="ghost" onClick={() => setIsExpanded(true)}>
                            <Settings className="w-4 h-4" />
                        </Button>
                    </div>
                </CardContent>

                <CustomHandle
                    type="target"
                    position={Position.Left}
                    className="!size-2 !bg-primary"
                    connectionCount={1}
                />
                <CustomHandle
                    type="source"
                    position={Position.Right}
                    className="!size-2 !bg-primary"
                    connectionCount={1}
                />
            </Card>
        )
    }

    return (
        <Card className={`w-[600px] ${selected ? "ring-2 ring-primary" : ""}`}>
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-md bg-orange-500 flex items-center justify-center">
                            <Zap className="w-4 h-4 text-white" />
                        </div>
                        <CardTitle className="text-sm">{data.label}</CardTitle>
                    </div>
                    <div className="flex gap-2">
                        <Button size="sm" onClick={executeRequest} className="nodrag">
                            <Play className="w-4 h-4" />
                            Ejecutar
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => setIsExpanded(false)}>
                            <X />
                        </Button>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="space-y-4">
                {/* Request Configuration */}
                <div className="flex gap-2">
                <Select value={config.method} onValueChange={(value) => setConfig((prev) => ({ ...prev, method: value }))}>
                    <SelectTrigger className="w-24">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="GET">GET</SelectItem>
                        <SelectItem value="POST">POST</SelectItem>
                        <SelectItem value="PUT">PUT</SelectItem>
                        <SelectItem value="DELETE">DELETE</SelectItem>
                        <SelectItem value="PATCH">PATCH</SelectItem>
                        <SelectItem value="HEAD">HEAD</SelectItem>
                        <SelectItem value="OPTIONS">OPTIONS</SelectItem>
                    </SelectContent>
                </Select>
                <Input
                    placeholder="https://api.ejemplo.com/endpoint"
                    value={config.url}
                    onChange={(e) => setConfig((prev) => ({ ...prev, url: e.target.value }))}
                    className="flex-1"
                />
                </div>

                <Tabs defaultValue="headers" className="w-full">
                    <TabsList className="grid w-full grid-cols-5 gap-1">
                        <TabsTrigger value="headers">Headers</TabsTrigger>
                        <TabsTrigger value="auth">Auth</TabsTrigger>
                        <TabsTrigger value="body">Body</TabsTrigger>
                        <TabsTrigger value="scripts">Scripts</TabsTrigger>
                        <TabsTrigger value="settings">Settings</TabsTrigger>
                    </TabsList>

                    <TabsContent value="headers" className="space-y-3">
                        <div className="flex gap-2">
                            <Input placeholder="Header Key" value={newHeaderKey} onChange={(e) => setNewHeaderKey(e.target.value)} />
                            <Input
                                placeholder="Header Value"
                                value={newHeaderValue}
                                onChange={(e) => setNewHeaderValue(e.target.value)}
                            />
                            <Button onClick={addHeader} size="sm">
                                Agregar
                            </Button>
                        </div>
                        <div className="space-y-2 max-h-32 overflow-y-auto">
                            {Object.entries(config.headers).map(([key, value]) => (
                                <div key={key} className="flex items-center gap-2 p-2 bg-muted rounded">
                                    <span className="text-sm font-medium">{key}:</span>
                                    <span className="text-sm flex-1">{value}</span>
                                    <Button size="sm" variant="ghost" onClick={() => removeHeader(key)}>
                                        ×
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </TabsContent>

                    <TabsContent value="auth" className="space-y-3">
                        <Select
                            value={config.authorization.type}
                            onValueChange={(value) =>
                                setConfig((prev) => ({ ...prev, authorization: { ...prev.authorization, type: value } }))
                            }
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="none">No Auth</SelectItem>
                                <SelectItem value="bearer">Bearer Token</SelectItem>
                                <SelectItem value="basic">Basic Auth</SelectItem>
                                <SelectItem value="apikey">API Key</SelectItem>
                            </SelectContent>
                        </Select>

                        {config.authorization.type === "bearer" && (
                            <Input
                                placeholder="Token"
                                value={config.authorization.token || ""}
                                onChange={(e) =>
                                    setConfig((prev) => ({ ...prev, authorization: { ...prev.authorization, token: e.target.value } }))
                                }
                            />
                        )}

                        {config.authorization.type === "basic" && (
                            <div className="space-y-2">
                                <Input
                                    placeholder="Username"
                                    value={config.authorization.username || ""}
                                    onChange={(e) =>
                                        setConfig((prev) => ({
                                        ...prev,
                                        authorization: { ...prev.authorization, username: e.target.value },
                                        }))
                                    }
                                />
                                <Input
                                    type="password"
                                    placeholder="Password"
                                    value={config.authorization.password || ""}
                                    onChange={(e) =>
                                        setConfig((prev) => ({
                                        ...prev,
                                        authorization: { ...prev.authorization, password: e.target.value },
                                        }))
                                    }
                                />
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="body" className="space-y-3">
                        <Select
                            value={config.body.type}
                            onValueChange={(value) => setConfig((prev) => ({ ...prev, body: { ...prev.body, type: value } }))}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="none">None</SelectItem>
                                <SelectItem value="form-data">Form Data</SelectItem>
                                <SelectItem value="x-www-form-urlencoded">x-www-form-urlencoded</SelectItem>
                                <SelectItem value="raw">Raw</SelectItem>
                                <SelectItem value="binary">Binary</SelectItem>
                            </SelectContent>
                        </Select>

                        {config.body.type === "raw" && (
                            <div className="space-y-2">
                                <Select defaultValue="json">
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="json">JSON</SelectItem>
                                        <SelectItem value="javascript">JavaScript</SelectItem>
                                        <SelectItem value="text">Text</SelectItem>
                                        <SelectItem value="html">HTML</SelectItem>
                                        <SelectItem value="xml">XML</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Textarea
                                    placeholder="Request body content"
                                    value={config.body.content}
                                    onChange={(e) => setConfig((prev) => ({ ...prev, body: { ...prev.body, content: e.target.value } }))}
                                    className="min-h-24"
                                />
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="scripts" className="space-y-3">
                        <div className="space-y-3">
                            <div>
                                <Label className="flex items-center gap-2 mb-2">
                                    <Code className="w-4 h-4" />
                                    Pre-request Script
                                </Label>
                                <Textarea
                                    placeholder="// Script que se ejecuta antes de la petición"
                                    value={config.preRequestScript}
                                    onChange={(e) => setConfig((prev) => ({ ...prev, preRequestScript: e.target.value }))}
                                    className="min-h-20 font-mono text-sm"
                                />
                            </div>
                            <div>
                                <Label className="flex items-center gap-2 mb-2">
                                    <TestTube className="w-4 h-4" />
                                    Tests
                                </Label>
                                <Textarea
                                    placeholder="// Tests que se ejecutan después de la petición"
                                    value={config.tests}
                                    onChange={(e) => setConfig((prev) => ({ ...prev, tests: e.target.value }))}
                                    className="min-h-20 font-mono text-sm"
                                />
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="settings" className="space-y-4">
                        <div className="space-y-4">
                            <div>
                                <Label>HTTP Version</Label>
                                <Select
                                    value={config.settings.httpVersion}
                                    onValueChange={(value) =>
                                        setConfig((prev) => ({ ...prev, settings: { ...prev.settings, httpVersion: value } }))
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="HTTP/1.0">HTTP/1.0</SelectItem>
                                        <SelectItem value="HTTP/1.1">HTTP/1.1</SelectItem>
                                        <SelectItem value="HTTP/2">HTTP/2</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <Separator />

                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <Label>Enable SSL certificate verification</Label>
                                    <Switch
                                        checked={config.settings.sslVerification}
                                        onCheckedChange={(checked) =>
                                        setConfig((prev) => ({ ...prev, settings: { ...prev.settings, sslVerification: checked } }))
                                        }
                                    />
                                </div>

                                <div className="flex items-center justify-between">
                                    <Label>Automatically follow redirects</Label>
                                    <Switch
                                        checked={config.settings.followRedirects}
                                        onCheckedChange={(checked) =>
                                            setConfig((prev) => ({ ...prev, settings: { ...prev.settings, followRedirects: checked } }))
                                        }
                                    />
                                </div>

                                <div className="flex items-center justify-between">
                                    <Label>Follow original HTTP Method</Label>
                                    <Switch
                                        checked={config.settings.followOriginalMethod}
                                        onCheckedChange={(checked) =>
                                            setConfig((prev) => ({ ...prev, settings: { ...prev.settings, followOriginalMethod: checked } }))
                                        }
                                    />
                                </div>

                                <div className="flex items-center justify-between">
                                    <Label>Follow Authorization header</Label>
                                    <Switch
                                        checked={config.settings.followAuthHeader}
                                        onCheckedChange={(checked) =>
                                            setConfig((prev) => ({ ...prev, settings: { ...prev.settings, followAuthHeader: checked } }))
                                        }
                                    />
                                </div>

                                <div className="flex items-center justify-between">
                                    <Label>Encode URL automatically</Label>
                                    <Switch
                                        checked={config.settings.encodeUrlAutomatically}
                                        onCheckedChange={(checked) =>
                                            setConfig((prev) => ({
                                                ...prev,
                                                settings: { ...prev.settings, encodeUrlAutomatically: checked },
                                            }))
                                        }
                                    />
                                </div>

                                <div className="flex items-center justify-between">
                                    <Label>Disable cookie jar</Label>
                                    <Switch
                                        checked={config.settings.disableCookieJar}
                                        onCheckedChange={(checked) =>
                                            setConfig((prev) => ({ ...prev, settings: { ...prev.settings, disableCookieJar: checked } }))
                                        }
                                    />
                                </div>
                            </div>

                            <Separator />

                            <div>
                                <Label>Maximum number of redirects</Label>
                                <Input
                                    type="number"
                                    value={config.settings.maxRedirects}
                                    onChange={(e) =>
                                        setConfig((prev) => ({
                                            ...prev,
                                            settings: { ...prev.settings, maxRedirects: Number.parseInt(e.target.value) || 10 },
                                        }))
                                    }
                                    className="mt-1"
                                />
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </CardContent>

            <CustomHandle
                type="target"
                position={Position.Left}
                className="!size-2 !bg-primary"
                connectionCount={2}
            />
            <CustomHandle
                type="source"
                position={Position.Right}
                className="!size-2 !bg-primary"
                connectionCount={2}
            />
        </Card>
    )
}
