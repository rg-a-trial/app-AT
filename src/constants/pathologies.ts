// Liste des pathologies partagée dans toute l'application
export const PATHOLOGIES = [
  { value: "all", label: "Toutes les pathologies" },
  { value: "cancer-sein", label: "Cancer du sein" },
  { value: "cancer-poumon", label: "Cancer du poumon" },
  { value: "cancer-prostate", label: "Cancer de la prostate" },
  { value: "cancer-colon", label: "Cancer du colon" },
  { value: "cancer-rectum", label: "Cancer du rectum" },
  { value: "cancer-anus", label: "Cancer de l'anus" },
  { value: "cancer-rein", label: "Cancer du rein" },
  { value: "cancer-pancreas", label: "Cancer du pancréas" },
  { value: "cancer-foie", label: "Cancer du foie et des voies biliaires" },
  { value: "cancer-vessie", label: "Cancer de la vessie / VES / urètre" },
  { value: "cancer-estomac", label: "Cancer de l'estomac et de l'oesophage" },
  { value: "cancer-endometre", label: "Cancer de l'endomètre" },
  { value: "lymphome", label: "Lymphome" },
  { value: "llc-richter", label: "LLC & syndrome de Richter" },
] as const;

// Liste des pathologies avec couleurs pour les graphiques
export const PATHOLOGIES_WITH_COLORS = [
  { id: "cancer-sein", label: "Cancer du sein", color: "hsl(195 66% 54%)" },
  { id: "cancer-poumon", label: "Cancer du poumon", color: "hsl(142 76% 46%)" },
  { id: "cancer-prostate", label: "Cancer de la prostate", color: "hsl(30 100% 55%)" },
  { id: "cancer-colon", label: "Cancer du colon", color: "hsl(45 100% 60%)" },
  { id: "cancer-rectum", label: "Cancer du rectum", color: "hsl(280 65% 55%)" },
  { id: "cancer-anus", label: "Cancer de l'anus", color: "hsl(0 84% 60%)" },
  { id: "cancer-rein", label: "Cancer du rein", color: "hsl(200 70% 50%)" },
  { id: "cancer-pancreas", label: "Cancer du pancréas", color: "hsl(15 90% 50%)" },
  { id: "cancer-foie", label: "Cancer du foie et des voies biliaires", color: "hsl(160 70% 45%)" },
  { id: "cancer-vessie", label: "Cancer de la vessie / VES / urètre", color: "hsl(320 60% 55%)" },
  { id: "cancer-estomac", label: "Cancer de l'estomac et de l'oesophage", color: "hsl(220 65% 50%)" },
  { id: "cancer-endometre", label: "Cancer de l'endomètre", color: "hsl(60 80% 55%)" },
  { id: "lymphome", label: "Lymphome", color: "hsl(180 60% 50%)" },
  { id: "llc-richter", label: "LLC & syndrome de Richter", color: "hsl(340 70% 55%)" },
] as const;

// Liste des régions françaises
export const REGIONS = [
  { value: "all", label: "Toutes les régions" },
  { value: "auvergne-rhone-alpes", label: "Auvergne-Rhône-Alpes" },
  { value: "bourgogne-franche-comte", label: "Bourgogne-Franche-Comté" },
  { value: "bretagne", label: "Bretagne" },
  { value: "centre-val-de-loire", label: "Centre-Val de Loire" },
  { value: "corse", label: "Corse" },
  { value: "grand-est", label: "Grand Est" },
  { value: "hauts-de-france", label: "Hauts-de-France" },
  { value: "ile-de-france", label: "Île-de-France" },
  { value: "normandie", label: "Normandie" },
  { value: "nouvelle-aquitaine", label: "Nouvelle-Aquitaine" },
  { value: "occitanie", label: "Occitanie" },
  { value: "pays-de-la-loire", label: "Pays de la Loire" },
  { value: "provence-alpes-cote-azur", label: "Provence-Alpes-Côte d'Azur" },
] as const;

// Périodes communes
export const PERIODS = [
  { value: "last-30-days", label: "30 derniers jours" },
  { value: "last-90-days", label: "90 derniers jours" },
  { value: "last-6-months", label: "6 derniers mois" },
  { value: "last-12-months", label: "12 derniers mois" },
  { value: "custom", label: "Date personnalisée" },
] as const;

