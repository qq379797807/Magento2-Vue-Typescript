export interface ThemeConfig {
    [key: string]: {
        name: string,
        area: string,
        src: string,
        locale: string,
        parent?: string,
        styles: string,
        scripts: string,
        files: Array<string>
    }
}