/**
 * plugin/colorexperts/index.ts — Color Experts plugin registry.
 */

import { addBuilderElement, type PluginMeta } from "@/hook";
import beforeAfterPricingCardElement from "./elements/BeforeAfterPricingCard";
import beforeAfterPricingCarouselElement from "./elements/BeforeAfterPricingCarousel";
import beforeAfterSliderBoxElement from "./elements/BeforeAfterSliderBox";
import testimonialsSliderElement from "./elements/TestimonialsSlider";
import clientsSliderElement from "./elements/ClientsSlider";
import serviceDetailCardElement from "./elements/ServiceDetailCard";
import hoverImageSwapCardElement from "./elements/HoverImageSwapCard";
import faqAccordionElement from "./elements/FaqAccordion";
import videoLightboxElement from "./elements/VideoLightbox";
import servicePricingCardElement from "./elements/ServicePricingCard";
import hoverBoxElement from "./elements/HoverBox";
import disclaimerElement from "./elements/Disclaimer";
import tabsElement from "./elements/Tabs";
import oneTabsElement from "./elements/OneTabs";
import sliderElement from "./elements/Slider";
import boxSliderElement from "./elements/BoxSlider";
import testimonialsElement from "./elements/Testimonials";

export const PLUGINS: PluginMeta = {
    nx:          "com.system.colorexperts",
    name:        "colorexperts",
    version:     "1.0.0",
    description: "Before/After image comparison pricing cards for clipping path services.",
    author:      "Color Experts",
    path:        "https://github.com/HOTLancerX/colorexperts.git",
    icon:        "solar:slider-minimalistic-horizontal-bold-duotone",
    color:       "from-emerald-500 to-teal-600",
};

export function register() {
    addBuilderElement(beforeAfterPricingCardElement, PLUGINS.nx);
    addBuilderElement(beforeAfterPricingCarouselElement, PLUGINS.nx);
    addBuilderElement(beforeAfterSliderBoxElement, PLUGINS.nx);
    addBuilderElement(testimonialsSliderElement, PLUGINS.nx);
    addBuilderElement(clientsSliderElement, PLUGINS.nx);
    addBuilderElement(serviceDetailCardElement, PLUGINS.nx);
    addBuilderElement(hoverImageSwapCardElement, PLUGINS.nx);
    addBuilderElement(faqAccordionElement, PLUGINS.nx);
    addBuilderElement(videoLightboxElement, PLUGINS.nx);
    addBuilderElement(servicePricingCardElement, PLUGINS.nx);
    addBuilderElement(hoverBoxElement, PLUGINS.nx);
    addBuilderElement(disclaimerElement, PLUGINS.nx);
    addBuilderElement(tabsElement, PLUGINS.nx);
    addBuilderElement(oneTabsElement, PLUGINS.nx);
    addBuilderElement(sliderElement, PLUGINS.nx);
    addBuilderElement(boxSliderElement, PLUGINS.nx);
    addBuilderElement(testimonialsElement, PLUGINS.nx);
}
