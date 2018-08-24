export interface OnboardingHtmlElement {
    style: {
        position: string,
        left: string,
        top: string,
        width: string,
        height: string
    };
    classList: {
        add: (name: string) => void,
        remove: (name: string) => void
    };
    offsetLeft: number;
    offsetTop: number;
    offsetWidth: number;
    offsetHeight: number;
    offsetParent?: OnboardingHtmlElement;
}
