import { formatDateToLocaleTime, formatDateToLocaleString } from "@/lib/dateFormatters";

describe("formatDateToLocaleTime", () => {
  it("formats a date into 12-hour or 24-hour format based on locale", () => {
    expect(formatDateToLocaleTime("2024-09-02T07:00:12.072Z", "en-US")).toContain("AM"); // en-US uses AM/PM
    expect(formatDateToLocaleTime("2024-09-02T14:30:00.000Z", "de-DE")).not.toContain("AM"); // de-DE uses 24-hour format
  });
});

describe("formatDateToLocaleString", () => {
  it("formats date correctly based on locale", () => {
    expect(formatDateToLocaleString("2024-09-02T07:00:12.072Z", "en-US")).toContain("Sep");
    expect(formatDateToLocaleString("2024-09-02T07:00:12.072Z", "de-DE")).toContain("Sept");
    expect(formatDateToLocaleString("2024-09-02T07:00:12.072Z", "ar-EG")).toContain("سبتمبر");
  });
});
