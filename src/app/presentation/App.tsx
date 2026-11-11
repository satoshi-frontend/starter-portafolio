import {
  Badge,
  Button,
  Card,
  CookieConsent,
  Container,
  FormField,
  GuidedTour,
  Header,
  SectionHeading,
  Stat,
  Textarea,
  ThemeSelector,
  useLanguage,
} from "@satoshi-rc-ui";
import { useEffect, useMemo, useState } from "react";

import type { FocusEvent, FormEvent, JSX } from "react";

interface Project {
  readonly title: string;
  readonly category: string;
  readonly description: string;
  readonly image: string;
  readonly imageAlt: string;
  readonly number: string;
}

const PROJECTS: readonly Project[] = [
  {
    title: "portfolio.projects.items.luma.title",
    category: "portfolio.projects.items.luma.category",
    description: "portfolio.projects.items.luma.description",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1400&q=85",
    imageAlt: "portfolio.projects.items.luma.imageAlt",
    number: "01",
  },
  {
    title: "portfolio.projects.items.casa.title",
    category: "portfolio.projects.items.casa.category",
    description: "portfolio.projects.items.casa.description",
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1400&q=85",
    imageAlt: "portfolio.projects.items.casa.imageAlt",
    number: "02",
  },
  {
    title: "portfolio.projects.items.verde.title",
    category: "portfolio.projects.items.verde.category",
    description: "portfolio.projects.items.verde.description",
    image:
      "https://images.unsplash.com/photo-1558655146-9f40138edfeb?auto=format&fit=crop&w=1400&q=85",
    imageAlt: "portfolio.projects.items.verde.imageAlt",
    number: "03",
  },
  {
    title: "portfolio.projects.items.pulse.title",
    category: "portfolio.projects.items.pulse.category",
    description: "portfolio.projects.items.pulse.description",
    image:
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1400&q=85",
    imageAlt: "portfolio.projects.items.pulse.imageAlt",
    number: "04",
  },
  {
    title: "portfolio.projects.items.nova.title",
    category: "portfolio.projects.items.nova.category",
    description: "portfolio.projects.items.nova.description",
    image:
      "https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=1400&q=85",
    imageAlt: "portfolio.projects.items.nova.imageAlt",
    number: "05",
  },
];

const SERVICES = [
  { number: "01", title: "portfolio.services.brand.title", icon: "✳" },
  { number: "02", title: "portfolio.services.digital.title", icon: "↗" },
  { number: "03", title: "portfolio.services.space.title", icon: "⌘" },
] as const;

const PROCESS_STEPS = [
  "portfolio.process.steps.discover",
  "portfolio.process.steps.design",
  "portfolio.process.steps.build",
  "portfolio.process.steps.evolve",
] as const;

const VALUE_POINTS = [
  "portfolio.value.points.partnership",
  "portfolio.value.points.practical",
  "portfolio.value.points.scale",
] as const;

const FAQ_ITEMS = [
  "portfolio.faq.items.scope",
  "portfolio.faq.items.timeline",
  "portfolio.faq.items.collaboration",
] as const;

const AUTOPLAY_INTERVAL_MS = 6000;
const COUNTER_PADDING_WIDTH = 2;
const COOKIE_CONSENT_STORAGE_KEY = "satoshi-cookie-consent";

/**
 * @description Comprueba si ya se guardo una preferencia valida de privacidad.
 * @returns Devuelve si existe una eleccion de privacidad almacenada.
 * @author Steveen Cues
 * @version 1.0.0
 */
function hasSavedCookiePreference(): boolean {
  try {
    const saved = window.localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY);
    if (saved === null) {
      return false;
    }

    const preference: unknown = JSON.parse(saved);
    return (
      typeof preference === "object" &&
      preference !== null &&
      "necessary" in preference &&
      preference.necessary === true &&
      "optional" in preference &&
      typeof preference.optional === "boolean"
    );
  } catch (error) {
    console.error("Unable to read cookie consent preference.", error);
    return false;
  }
}

/**
 * @description Desplaza la vista hasta la seccion indicada.
 * @param sectionId Identificador de la seccion de destino.
 * @returns No devuelve ningun valor.
 * @author Steveen Cues
 * @version 1.0.0
 */
function scrollToSection(sectionId: string): void {
  document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
}

/**
 * @description Presenta el portafolio digital de Satoshi Software Solutions.
 * @author Steveen Cues
 * @version 1.0.0
 * @returns La landing page de Satoshi.
 */
export default function App(): JSX.Element {
  const { t } = useLanguage();
  const [hasPrivacyChoice, setHasPrivacyChoice] = useState(
    hasSavedCookiePreference,
  );
  const [activeProject, setActiveProject] = useState(0);
  const [isAutoplayEnabled, setIsAutoplayEnabled] = useState(true);
  const [isCarouselInteracting, setIsCarouselInteracting] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [contactDraftOpened, setContactDraftOpened] = useState(false);
  const project = PROJECTS[activeProject];
  const tourSteps = useMemo(
    () => [
      {
        targetId: "hero",
        title: t("portfolio.tour.steps.intro.title"),
        description: t("portfolio.tour.steps.intro.description"),
      },
      {
        targetId: "work",
        title: t("portfolio.tour.steps.work.title"),
        description: t("portfolio.tour.steps.work.description"),
      },
      {
        targetId: "services",
        title: t("portfolio.tour.steps.services.title"),
        description: t("portfolio.tour.steps.services.description"),
      },
      {
        targetId: "process",
        title: t("portfolio.tour.steps.process.title"),
        description: t("portfolio.tour.steps.process.description"),
      },
      {
        targetId: "contact",
        title: t("portfolio.tour.steps.contact.title"),
        description: t("portfolio.tour.steps.contact.description"),
      },
    ],
    [t],
  );

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (!isAutoplayEnabled || isCarouselInteracting || prefersReducedMotion) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setActiveProject((current) => (current + 1) % PROJECTS.length);
    }, AUTOPLAY_INTERVAL_MS);

    return (): void => window.clearInterval(intervalId);
  }, [isAutoplayEnabled, isCarouselInteracting]);

  const changeProject = (direction: "next" | "previous"): void => {
    setActiveProject((current) => {
      if (direction === "next") {
        return (current + 1) % PROJECTS.length;
      }

      return current === 0 ? PROJECTS.length - 1 : current - 1;
    });
  };

  const handleCarouselBlur = (event: FocusEvent<HTMLDivElement>): void => {
    if (
      !(event.relatedTarget instanceof Node) ||
      !event.currentTarget.contains(event.relatedTarget)
    ) {
      setIsCarouselInteracting(false);
    }
  };

  const handleContactSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    const subject = encodeURIComponent(
      `${t("portfolio.contact.form.subject")}: ${contactForm.name}`,
    );
    const body = encodeURIComponent(
      [
        `${t("portfolio.contact.form.name")}: ${contactForm.name}`,
        `${t("portfolio.contact.form.email")}: ${contactForm.email}`,
        "",
        `${t("portfolio.contact.form.message")}:`,
        contactForm.message,
      ].join("\n"),
    );

    window.open(`mailto:?subject=${subject}&body=${body}`, "_blank");
    setContactDraftOpened(true);
  };

  return (
    <div className="min-h-screen bg-base-100 text-base-content" id="top">
      <Header
        logo={{
          src: "/LightBackgroundLogo.png",
          alt: t("portfolio.brand"),
          href: "#top",
          width: 150,
          height: 84,
        }}
        navigationItems={[
          { label: t("portfolio.navigation.work"), href: "#work" },
          { label: t("portfolio.navigation.services"), href: "#services" },
          { label: t("portfolio.navigation.faq"), href: "#faq" },
          { label: t("portfolio.navigation.about"), href: "#about" },
        ]}
        showThemeSelector={false}
        showLanguageSelector={true}
        translations={{
          menuOpen: "menu.open",
          menuClose: "menu.close",
          navigationLabel: "navigation.main",
        }}
        additionalActions={
          <>
            <ThemeSelector
              className="w-40"
              translations={{
                title: "preferences.appearance.theme.title",
                select: "preferences.appearance.theme.select",
                selected: "preferences.appearance.theme.selected",
                searchPlaceholder: "preferences.appearance.theme.search",
                empty: "preferences.appearance.theme.empty",
                of: "common.results.of",
                results: "preferences.appearance.theme.results",
                close: "preferences.appearance.theme.close",
              }}
            />
            <a className="btn btn-primary btn-sm" href="#contact">
              {t("portfolio.navigation.contact")}
              <span aria-hidden="true">↗</span>
            </a>
          </>
        }
      />

      <main>
        <section aria-labelledby="hero-title" className="bg-base-200" id="hero">
          <Container
            className="py-12 md:py-20"
            direction="column"
            maxWidth="xl"
            padding="md"
          >
            <div className="grid items-center gap-10 lg:grid-cols-2">
              <div className="space-y-6">
                <Badge variant="primary">{t("portfolio.hero.eyebrow")}</Badge>
                <h1 className="max-w-2xl text-5xl font-bold tracking-tight md:text-7xl">
                  {t("portfolio.hero.title")}
                  <span className="text-primary">
                    {" "}
                    {t("portfolio.hero.titleAccent")}
                  </span>
                </h1>
                <p className="max-w-xl text-lg text-base-content/70">
                  {t("portfolio.hero.description")}
                </p>
                <div className="flex flex-wrap items-center gap-4">
                  <Button
                    onClick={() => scrollToSection("work")}
                    variant="primary"
                  >
                    {t("portfolio.hero.primaryCta")}
                    <span aria-hidden="true">↗</span>
                  </Button>
                  <a className="link link-hover" href="#about">
                    {t("portfolio.hero.secondaryCta")}
                  </a>
                </div>
                <p className="text-sm text-base-content/70">
                  {t("portfolio.hero.note")}
                </p>
              </div>

              <div
                aria-label={t("portfolio.carousel.label")}
                aria-roledescription={t("portfolio.carousel.roleDescription")}
                className="space-y-3"
                onBlurCapture={handleCarouselBlur}
                onFocusCapture={() => setIsCarouselInteracting(true)}
                onMouseEnter={() => setIsCarouselInteracting(true)}
                onMouseLeave={() => setIsCarouselInteracting(false)}
                role="region"
              >
                <div className="card relative isolate aspect-[4/3] overflow-hidden bg-neutral text-secondary-content shadow-xl">
                  <img
                    alt={t(project.imageAlt)}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700"
                    key={project.image}
                    src={project.image}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                  <div
                    aria-live="off"
                    className="card-body relative flex flex-col justify-between"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <Badge variant="primary">
                        {t("portfolio.carousel.featured")}
                      </Badge>
                      <span className="badge badge-neutral badge-outline">
                        {project.number} /{" "}
                        {String(PROJECTS.length).padStart(
                          COUNTER_PADDING_WIDTH,
                          "0",
                        )}
                      </span>
                    </div>
                    <div className="flex items-end justify-between gap-4">
                      <div>
                        <p className="text-sm">{t(project.category)}</p>
                        <h2 className="card-title text-3xl md:text-4xl">
                          {t(project.title)}
                        </h2>
                        <p className="mt-1 max-w-md text-sm">
                          {t(project.description)}
                        </p>
                      </div>
                      <div className="join">
                        <button
                          aria-label={t("portfolio.carousel.previous")}
                          className="btn btn-circle btn-sm join-item"
                          onClick={() => changeProject("previous")}
                          type="button"
                        >
                          <span aria-hidden="true">←</span>
                        </button>
                        <button
                          aria-label={t("portfolio.carousel.next")}
                          className="btn btn-circle btn-sm join-item"
                          onClick={() => changeProject("next")}
                          type="button"
                        >
                          <span aria-hidden="true">→</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  aria-label={t("portfolio.carousel.pagination")}
                  className="flex flex-wrap items-center justify-between gap-3"
                >
                  <div className="join">
                    {PROJECTS.map((item, index) => (
                      <button
                        aria-label={`${t("portfolio.carousel.goTo")} ${index + 1}`}
                        aria-pressed={index === activeProject}
                        className={`btn btn-xs join-item ${
                          index === activeProject ? "btn-primary" : "btn-ghost"
                        }`}
                        key={item.number}
                        onClick={() => setActiveProject(index)}
                        type="button"
                      >
                        {item.number}
                      </button>
                    ))}
                  </div>
                  <button
                    aria-label={t(
                      isAutoplayEnabled
                        ? "portfolio.carousel.pause"
                        : "portfolio.carousel.play",
                    )}
                    className="btn btn-ghost btn-sm"
                    onClick={() => setIsAutoplayEnabled((enabled) => !enabled)}
                    type="button"
                  >
                    {t(
                      isAutoplayEnabled
                        ? "portfolio.carousel.pause"
                        : "portfolio.carousel.play",
                    )}
                  </button>
                </div>
              </div>
            </div>
          </Container>
        </section>

        <section
          aria-label={t("portfolio.clients.label")}
          className="border-y border-base-300"
        >
          <Container
            className="py-8"
            direction="column"
            maxWidth="xl"
            padding="md"
          >
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <p className="text-sm font-semibold text-base-content/70">
                {t("portfolio.clients.title")}
              </p>
              <div className="flex flex-wrap items-center justify-between gap-5 text-lg font-bold md:gap-10">
                <span>WEB</span>
                <span>CLOUD</span>
                <span>DATA</span>
                <span>MOBILE</span>
                <span>AI</span>
              </div>
            </div>
          </Container>
        </section>

        <Container
          as="section"
          className="space-y-8"
          direction="column"
          id="work"
          maxWidth="xl"
          padding="md"
          sectionSpacing="standard"
        >
          <SectionHeading
            eyebrow={t("portfolio.work.kicker")}
            level={2}
            size="lg"
            subtitle={t("portfolio.work.intro")}
            title={t("portfolio.work.title")}
          />

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {PROJECTS.map((item, index) => (
              <button
                aria-label={`${t("portfolio.work.openProject")} ${t(item.title)}`}
                className="text-left"
                key={item.number}
                onClick={() => {
                  setActiveProject(index);
                  scrollToSection("top");
                }}
                type="button"
              >
                <Card
                  className="card bg-base-100 shadow-md transition-shadow hover:shadow-xl"
                  variant="base"
                >
                  <figure className="aspect-[4/3]">
                    <img
                      alt={t(item.imageAlt)}
                      className="h-full w-full object-cover"
                      loading="lazy"
                      src={item.image}
                    />
                  </figure>
                  <div className="card-body">
                    <p className="text-sm text-primary">{t(item.category)}</p>
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="card-title">{t(item.title)}</h3>
                      <span className="badge badge-outline">{item.number}</span>
                    </div>
                    <p className="text-sm text-base-content/70">
                      {t(item.description)}
                    </p>
                  </div>
                </Card>
              </button>
            ))}
          </div>
          <div className="flex flex-col justify-between gap-3 border-t border-base-300 pt-5 sm:flex-row">
            <p className="text-sm text-base-content/70">
              {t("portfolio.work.footer")}
            </p>
            <a className="link link-primary" href="#contact">
              {t("portfolio.work.cta")} ↗
            </a>
          </div>
        </Container>

        <Container
          as="section"
          className="space-y-8 bg-base-200"
          direction="column"
          id="value"
          maxWidth="full"
          padding="md"
          sectionSpacing="standard"
        >
          <div className="mx-auto w-full max-w-7xl space-y-8">
            <SectionHeading
              eyebrow={t("portfolio.value.kicker")}
              level={2}
              size="lg"
              subtitle={t("portfolio.value.description")}
              title={t("portfolio.value.title")}
            />
            <div className="grid gap-4 md:grid-cols-3">
              {VALUE_POINTS.map((point, index) => (
                <Card
                  className="card border border-base-300 bg-base-100 shadow-sm"
                  key={point}
                  variant="base"
                >
                  <div className="card-body">
                    <span className="badge badge-primary badge-outline">
                      {String(index + 1).padStart(COUNTER_PADDING_WIDTH, "0")}
                    </span>
                    <h3 className="card-title mt-3">{t(`${point}.title`)}</h3>
                    <p className="text-base-content/70">
                      {t(`${point}.description`)}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </Container>

        <section
          aria-labelledby="services-title"
          className="bg-base-200"
          id="services"
        >
          <Container
            className="space-y-8"
            direction="column"
            maxWidth="xl"
            padding="md"
            sectionSpacing="standard"
          >
            <SectionHeading
              eyebrow={t("portfolio.services.kicker")}
              id="services-title"
              level={2}
              size="lg"
              subtitle={t("portfolio.services.intro")}
              title={t("portfolio.services.title")}
            />
            <div className="grid gap-4 md:grid-cols-3">
              {SERVICES.map((service) => (
                <Card
                  className="card bg-base-100 shadow-sm"
                  key={service.number}
                  variant="base"
                >
                  <div className="card-body">
                    <div className="flex items-center justify-between">
                      <span className="badge badge-outline">
                        {service.number}
                      </span>
                      <span
                        aria-hidden="true"
                        className="text-2xl text-primary"
                      >
                        {service.icon}
                      </span>
                    </div>
                    <h3 className="card-title mt-5">{t(service.title)}</h3>
                    <p className="text-base-content/70">
                      {t(service.title.replace(".title", ".description"))}
                    </p>
                    <a
                      className="link link-primary mt-3 self-start"
                      href="#contact"
                    >
                      {t("portfolio.services.discover")} ↗
                    </a>
                  </div>
                </Card>
              ))}
            </div>
          </Container>
        </section>

        <Container
          as="section"
          className="space-y-8"
          direction="column"
          id="process"
          maxWidth="xl"
          padding="md"
          sectionSpacing="standard"
        >
          <SectionHeading
            eyebrow={t("portfolio.process.kicker")}
            level={2}
            size="lg"
            subtitle={t("portfolio.process.description")}
            title={t("portfolio.process.title")}
          />
          <ol className="steps steps-vertical w-full lg:steps-horizontal">
            {PROCESS_STEPS.map((step, index) => (
              <li className="step step-primary" key={step}>
                <div className="card mt-4 w-full bg-base-200 text-left shadow-sm">
                  <div className="card-body p-5">
                    <span className="text-sm font-semibold text-primary">
                      {String(index + 1).padStart(COUNTER_PADDING_WIDTH, "0")}
                    </span>
                    <h3 className="card-title text-lg">{t(`${step}.title`)}</h3>
                    <p className="text-sm text-base-content/70">
                      {t(`${step}.description`)}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </Container>

        <Container
          as="section"
          className="space-y-8"
          direction="column"
          id="faq"
          maxWidth="xl"
          padding="md"
          sectionSpacing="standard"
        >
          <SectionHeading
            eyebrow={t("portfolio.faq.kicker")}
            level={2}
            size="lg"
            subtitle={t("portfolio.faq.description")}
            title={t("portfolio.faq.title")}
          />
          <div className="flex w-full min-w-0 flex-col gap-3">
            {FAQ_ITEMS.map((item) => (
              <details
                className="collapse-arrow collapse w-full min-w-0 rounded-box border border-base-300 bg-base-100"
                key={item}
              >
                <summary className="collapse-title font-semibold">
                  {t(`${item}.question`)}
                </summary>
                <p className="collapse-content text-base-content/70">
                  {t(`${item}.answer`)}
                </p>
              </details>
            ))}
          </div>
          <a className="btn btn-primary self-start" href="#contact">
            {t("portfolio.faq.cta")}
            <span aria-hidden="true">↗</span>
          </a>
        </Container>

        <Container
          as="section"
          className="space-y-8"
          direction="column"
          id="about"
          maxWidth="xl"
          padding="md"
          sectionSpacing="standard"
        >
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <figure className="overflow-hidden rounded-box bg-base-200">
              <img
                alt={t("portfolio.about.imageAlt")}
                className="aspect-[4/3] w-full object-cover"
                loading="lazy"
                src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=85"
              />
            </figure>
            <div className="space-y-5">
              <SectionHeading
                eyebrow={t("portfolio.about.kicker")}
                level={2}
                size="lg"
                subtitle={t("portfolio.about.description")}
                title={t("portfolio.about.title")}
              />
              <a className="link link-primary" href="#contact">
                {t("portfolio.about.cta")} ↗
              </a>
              <div className="stats stats-vertical mt-5 w-full shadow md:stats-horizontal">
                <Stat
                  title={t("portfolio.about.stats.years")}
                  value="01"
                  variant="primary"
                />
                <Stat
                  title={t("portfolio.about.stats.projects")}
                  value="02"
                  variant="primary"
                />
                <Stat
                  title={t("portfolio.about.stats.awards")}
                  value="03"
                  variant="primary"
                />
              </div>
            </div>
          </div>
        </Container>

        <section
          aria-labelledby="contact-title"
          className="bg-base-200"
          id="contact"
        >
          <Container
            className="space-y-8"
            direction="column"
            maxWidth="xl"
            padding="md"
            sectionSpacing="standard"
          >
            <div className="grid items-start gap-10 lg:grid-cols-2">
              <div className="min-w-0 space-y-5 lg:sticky lg:top-24">
                <SectionHeading
                  eyebrow={t("portfolio.contact.badge")}
                  level={2}
                  size="lg"
                  id="contact-title"
                  subtitle={t("portfolio.contact.description")}
                  title={t("portfolio.contact.title")}
                />
                <div className="divider divider-start min-w-0 whitespace-normal break-words">
                  {t("portfolio.contact.responseTime")}
                </div>
                <p className="text-sm text-base-content/70">
                  {t("portfolio.contact.emailNote")}
                </p>
              </div>

              <Card
                className="card min-w-0 bg-base-100 shadow-xl"
                variant="base"
              >
                <form
                  className="card-body gap-5"
                  onSubmit={handleContactSubmit}
                >
                  <FormField
                    label={t("portfolio.contact.form.name")}
                    onChange={(name) => {
                      setContactForm((current) => ({ ...current, name }));
                      setContactDraftOpened(false);
                    }}
                    required
                    type="text"
                    value={contactForm.name}
                  />
                  <FormField
                    label={t("portfolio.contact.form.email")}
                    onChange={(email) => {
                      setContactForm((current) => ({ ...current, email }));
                      setContactDraftOpened(false);
                    }}
                    required
                    type="email"
                    value={contactForm.email}
                  />
                  <label className="form-control gap-2">
                    <span className="label-text font-medium">
                      {t("portfolio.contact.form.message")}
                    </span>
                    <Textarea
                      ariaLabel={t("portfolio.contact.form.message")}
                      className="min-h-36"
                      onChange={(message) => {
                        setContactForm((current) => ({ ...current, message }));
                        setContactDraftOpened(false);
                      }}
                      required
                      rows={5}
                      value={contactForm.message}
                    />
                  </label>
                  <p className="text-sm text-base-content/60">
                    {t("portfolio.contact.form.sendNote")}
                  </p>
                  <Button type="submit" variant="primary">
                    {t("portfolio.contact.form.submit")}
                    <span aria-hidden="true">↗</span>
                  </Button>
                  {contactDraftOpened && (
                    <p aria-live="polite" className="alert alert-success">
                      {t("portfolio.contact.form.draftOpened")}
                    </p>
                  )}
                </form>
              </Card>
            </div>
          </Container>
        </section>
      </main>

      <section
        aria-label={t("portfolio.privacy.title")}
        className="border-t border-base-300 bg-base-100"
        id="privacy"
      >
        <Container
          className="flex flex-col justify-between gap-4 py-8 md:flex-row md:items-center"
          maxWidth="xl"
          padding="md"
        >
          <div>
            <h2 className="font-semibold">{t("portfolio.privacy.title")}</h2>
            <p className="mt-1 max-w-2xl text-sm text-base-content/70">
              {t("portfolio.privacy.description")}
            </p>
          </div>
        </Container>
      </section>

      <footer className="footer footer-center bg-base-200 p-8 text-base-content">
        <a aria-label={t("portfolio.brand")} href="#top">
          <img
            alt=""
            className="w-40"
            height="89"
            src="/LightBackgroundLogo.png"
            width="160"
          />
        </a>
        <p>
          © {new Date().getFullYear()} {t("portfolio.brand")}.{" "}
          {t("portfolio.footer.rights")}
        </p>
        <a className="link link-hover" href="#top">
          {t("portfolio.footer.backToTop")} ↑
        </a>
      </footer>
      <GuidedTour
        enabled={hasPrivacyChoice}
        steps={tourSteps}
        translations={{
          openGuide: t("portfolio.tour.openGuide"),
          stepOf: t("portfolio.tour.stepOf"),
          back: t("portfolio.tour.back"),
          next: t("portfolio.tour.next"),
          skip: t("portfolio.tour.skip"),
          finish: t("portfolio.tour.finish"),
        }}
      />
      <CookieConsent
        onPreferenceSaved={() => setHasPrivacyChoice(true)}
        storageKey={COOKIE_CONSENT_STORAGE_KEY}
        translations={{
          title: t("portfolio.privacy.consent.title"),
          description: t("portfolio.privacy.consent.description"),
          details: t("portfolio.privacy.consent.details"),
          settings: t("portfolio.privacy.consent.settings"),
          necessary: t("portfolio.privacy.consent.necessary"),
          optional: t("portfolio.privacy.consent.optional"),
          acceptAll: t("portfolio.privacy.consent.acceptAll"),
          necessaryOnly: t("portfolio.privacy.consent.necessaryOnly"),
          manage: t("portfolio.privacy.consent.manage"),
          save: t("portfolio.privacy.consent.save"),
        }}
      />
    </div>
  );
}
