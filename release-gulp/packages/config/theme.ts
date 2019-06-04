export interface ThemeConfig {
    [key: string]: {
        name: string,
        area: string,
        src: string,
        locale: string,
        parent?: string,
        mode: string,
        styles: string,
        scripts: string,
        files: Array<string>
    }
}