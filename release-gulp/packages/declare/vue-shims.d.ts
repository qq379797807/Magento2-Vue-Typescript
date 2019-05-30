import Vue from 'vue'

declare module 'vue/types/options' {
    interface ComponentOptions<
        V extends Vue,
        Data = DefaultData<V>,
        Methods = DefaultMethods<V>,
        Computed = DefaultComputed,
        PropsDef = PropsDefinition<DefaultProps>,
        Props = DefaultProps> {
        [key: string]: any;
    } 
}

declare module 'vue/types/vue' {
    interface Vue {
        [key: string]: any
    }
}