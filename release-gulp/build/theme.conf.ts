import { ThemeConfig } from '../packages'

const themeConfig: ThemeConfig = {
    default: {
        name: 'car',
        area: 'frontend',
        src: 'Restful/car',
        locale: 'en_US',
        parent: '',
        mode: 'development',
        styles: 'scss',
        scripts: 'tsx',
        files: [
            'css/app.css'
        ]
    }
}

export default themeConfig