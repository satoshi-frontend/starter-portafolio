import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from "@jest/globals";
import { act, fireEvent, render, screen } from "@testing-library/react";
import type { ReactNode } from "react";

import App from "./App";

const mockT = (key: string): string => key;

jest.mock(
  "@satoshi-rc-ui",
  () => ({
    Badge: ({ children }: { children: ReactNode }) => <div>{children}</div>,
    Button: ({
      children,
      onClick,
    }: {
      children: ReactNode;
      onClick?: () => void;
    }) => <button onClick={onClick}>{children}</button>,
    Card: ({ children }: { children: ReactNode }) => (
      <article>{children}</article>
    ),
    Container: ({
      as: Tag = "div",
      children,
      id,
    }: {
      as?: "div" | "section";
      children: ReactNode;
      id?: string;
    }) => <Tag id={id}>{children}</Tag>,
    CookieConsent: ({
      onPreferenceSaved,
    }: {
      onPreferenceSaved?: () => void;
    }) => (
      <button onClick={onPreferenceSaved} type="button">
        Save privacy choice
      </button>
    ),
    FormField: ({
      label,
      onChange,
      required,
      type,
      value,
    }: {
      label: string;
      onChange?: (value: string) => void;
      required?: boolean;
      type?: string;
      value?: string;
    }) => (
      <label>
        {label}
        <input
          onChange={(event) => onChange?.(event.target.value)}
          required={required}
          type={type}
          value={value ?? ""}
        />
      </label>
    ),
    GuidedTour: ({ enabled }: { enabled?: boolean }) => (
      <div data-testid="guided-tour" data-enabled={enabled} />
    ),
    Header: () => <header />,
    Stat: () => <div />,
    SectionHeading: ({
      id,
      eyebrow,
      subtitle,
      title,
    }: {
      id?: string;
      eyebrow?: string;
      subtitle?: string;
      title: string;
    }) => {
      return (
        <header>
          {eyebrow && <p>{eyebrow}</p>}
          <h2 id={id}>{title}</h2>
          {subtitle && <p>{subtitle}</p>}
        </header>
      );
    },
    Textarea: ({
      ariaLabel,
      onChange,
      required,
      value,
    }: {
      ariaLabel: string;
      onChange?: (value: string) => void;
      required?: boolean;
      value?: string;
    }) => (
      <textarea
        aria-label={ariaLabel}
        onChange={(event) => onChange?.(event.target.value)}
        required={required}
        value={value ?? ""}
      />
    ),
    ThemeSelector: () => <div />,
    useLanguage: () => ({ t: mockT }),
  }),
  { virtual: true },
);

beforeEach(() => {
  window.localStorage.clear();
  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    value: (media: string): MediaQueryList => ({
      addEventListener: () => undefined,
      addListener: () => undefined,
      dispatchEvent: () => true,
      matches: false,
      media,
      onchange: null,
      removeEventListener: () => undefined,
      removeListener: () => undefined,
    }),
  });
});

describe("App privacy and guided tour", () => {
  it("waits for a saved privacy choice before starting the guided tour", () => {
    render(<App />);

    expect(screen.getByTestId("guided-tour").getAttribute("data-enabled")).toBe(
      "false",
    );

    fireEvent.click(
      screen.getByRole("button", { name: "Save privacy choice" }),
    );

    expect(screen.getByTestId("guided-tour").getAttribute("data-enabled")).toBe(
      "true",
    );
  });
});

describe("App featured project carousel", () => {
  afterEach(() => {
    jest.useRealTimers();
  });

  it("moves forward through the featured projects", () => {
    render(<App />);

    fireEvent.click(
      screen.getByRole("button", { name: "portfolio.carousel.next" }),
    );

    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "portfolio.projects.items.casa.title",
      }),
    ).toBeTruthy();
  });

  it("wraps to the last project when moving backward from the first", () => {
    render(<App />);

    fireEvent.click(
      screen.getByRole("button", { name: "portfolio.carousel.previous" }),
    );

    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "portfolio.projects.items.nova.title",
      }),
    ).toBeTruthy();
  });

  it("automatically advances through all five featured projects", () => {
    jest.useFakeTimers();
    render(<App />);

    act(() => {
      jest.advanceTimersByTime(6000);
    });

    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "portfolio.projects.items.casa.title",
      }),
    ).toBeTruthy();

    fireEvent.click(
      screen.getByRole("button", { name: "portfolio.carousel.goTo 5" }),
    );

    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "portfolio.projects.items.nova.title",
      }),
    ).toBeTruthy();
  });

  it("pauses autoplay while the carousel is hovered", () => {
    jest.useFakeTimers();
    render(<App />);

    fireEvent.mouseEnter(
      screen.getByRole("region", { name: "portfolio.carousel.label" }),
    );
    act(() => {
      jest.advanceTimersByTime(6000);
    });

    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "portfolio.projects.items.luma.title",
      }),
    ).toBeTruthy();
  });
});

describe("App contact form", () => {
  it("prepares a translated mail draft with the entered contact details", () => {
    const openWindow = jest
      .spyOn(window, "open")
      .mockImplementation(() => null);
    render(<App />);

    fireEvent.change(
      screen.getByRole("textbox", { name: "portfolio.contact.form.name" }),
      { target: { value: "Ada Lovelace" } },
    );
    fireEvent.change(
      screen.getByRole("textbox", { name: "portfolio.contact.form.email" }),
      { target: { value: "ada@example.com" } },
    );
    fireEvent.change(
      screen.getByRole("textbox", {
        name: "portfolio.contact.form.message",
      }),
      { target: { value: "Necesito una plataforma web." } },
    );
    fireEvent.submit(document.querySelector("form")!);

    expect(openWindow).toHaveBeenCalledWith(
      expect.stringContaining("mailto:?subject="),
      "_blank",
    );
    expect(
      decodeURIComponent(String(openWindow.mock.calls[0]?.[0] ?? "")),
    ).toContain("ada@example.com");
    expect(screen.getByText("portfolio.contact.form.draftOpened")).toBeTruthy();

    openWindow.mockRestore();
  });
});

describe("App customer information", () => {
  it("provides additional value and FAQ sections for prospective customers", () => {
    render(<App />);

    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "portfolio.value.title",
      }),
    ).toBeTruthy();
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "portfolio.faq.title",
      }),
    ).toBeTruthy();
    expect(
      screen.getByText("portfolio.faq.items.timeline.question"),
    ).toBeTruthy();
  });
});
