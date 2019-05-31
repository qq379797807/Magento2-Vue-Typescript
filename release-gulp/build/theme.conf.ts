import { ThemeConfig } from '../packages'

const themeConfig: ThemeConfig = {
    default: {
        name: 'car',
        area: 'frontend',
        src: 'Restful/car',
        locale: 'en_US',
        parent: '',
        styles: [
            '.scss'
        ],
        scripts: [
            '.tsx',
            '.vue'
        ],
        files: [
            'css/main.css'
        ]
    }
}

export default themeConfig