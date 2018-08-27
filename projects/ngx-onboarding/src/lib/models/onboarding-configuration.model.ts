/**
 * @author RKlein@rosen-group.com
 */
/**
 * global configuration parameters for onboarding
 * for icon configuration see: https://material.angular.io/components/icon/overview
 * because the properties below a derived from that behave exactly the same
 */
export interface OnboardingConfiguration {
    iconConfiguration?: OnboardingIconConfiguration;
    textConfiguration?: OnboardingTextConfiguration;
}

export interface OnboardingIconConfiguration {
    /**
     * name of a standard material icon by name (defaults to 'contact_support')
     */
    matIconName?: string;
    /**
     *  Use this for a registered font set (register it in iconRegistry first (see link in class header)
     * e.g. 'fa' (for fontawesome)
     */
    fontSet?: string;
    /**
     *  Use this to select an icon from a fontSet that you register like 'address-book'
     */
    fontIcon?: string;
    /**
     *  Set the name of an svg icon you want to use. Do not forget to register it in the iconregistry for material
     *  for example like this:
     *  ```typescript
     *  iconRegistry.addSvgIcon('onboarding_black',
     *              sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/onboarding_black.svg')
     *  );
     *  ```
     */
    svgIcon?: string;
    /** for the following matBadge* properties see https://material.angular.io/components/badge/overview */
    /**
     * material color for the counter background e.g. primary, accent, warn
     */
    matBadgeColor?: string;
    /**
     * size of the badge e.g. small, medium, large
     */
    matBadgeSize?: string;
    /**
     * above|below and before|after
     */
    matBadgePosition?: string;

}


export interface OnboardingTextConfiguration {
    regularFontFamily?: string;
    scriptFontFamily?: string;
}
