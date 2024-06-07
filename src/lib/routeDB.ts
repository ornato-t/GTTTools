export interface routeDB {
    code: Code
    name: string
    type: Type
    provider: string
}

interface Code {
    internal: string
    displayed: string
    integer: number
}

interface Type {
    code: number
    plain: string
}
