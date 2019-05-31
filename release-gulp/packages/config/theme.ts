export interface ThemeConfig {
    [key: string]: {
        name: string,
        area: string,
        src: string,
        locale: string,
        parent?: string,
        styles: Array<string>,
        scripts: Array<string>,
        files: Array<string>
    }
}