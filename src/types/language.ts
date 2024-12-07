export type Language = {
  code: string;
  name: string;
  nativeName: string;
};

export type LanguageContextType = {
  currentLanguage: Language;
  setLanguage: (language: Language) => void;
  languages: Language[];
};