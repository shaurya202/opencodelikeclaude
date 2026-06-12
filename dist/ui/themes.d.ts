export interface Theme {
    name: string;
    displayName: string;
    colors: {
        background: string;
        foreground: string;
        primary: string;
        secondary: string;
        accent: string;
        border: string;
        error: string;
        warning: string;
        success: string;
        info: string;
        prompt: string;
        input: string;
        output: string;
        comment: string;
        keyword: string;
        string: string;
        number: string;
        function: string;
        class: string;
        variable: string;
    };
}
export declare const builtinThemes: Record<string, Theme>;
export declare function getTheme(name: string): Theme | undefined;
export declare function listThemes(): string[];
//# sourceMappingURL=themes.d.ts.map