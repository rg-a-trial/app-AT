import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PageHeader } from "@/components/ui/page-header";
import { GlobalFilters, FilterState } from "@/components/filters/GlobalFilters";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Info, FileText, Download } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { PERIODS } from "@/constants/pathologies";

const allPathologies = [
  { id: "cancer-sein", label: "Cancer du sein", color: "hsl(195 66% 54%)" }, // Bleu clair
  { id: "cancer-poumon", label: "Cancer du poumon", color: "hsl(142 76% 46%)" }, // Vert
  { id: "cancer-prostate", label: "Cancer de la prostate", color: "hsl(30 100% 55%)" }, // Orange
  { id: "cancer-colon", label: "Cancer du colon", color: "hsl(45 100% 60%)" }, // Jaune
  { id: "cancer-rectum", label: "Cancer du rectum", color: "hsl(280 65% 55%)" }, // Violet
  { id: "cancer-anus", label: "Cancer de l'anus", color: "hsl(0 84% 60%)" }, // Rouge
  { id: "cancer-rein", label: "Cancer du rein", color: "hsl(200 70% 50%)" }, // Bleu foncé
  { id: "cancer-pancreas", label: "Cancer du pancréas", color: "hsl(15 90% 50%)" }, // Rouge-orange
  { id: "cancer-foie", label: "Cancer du foie et des voies biliaires", color: "hsl(160 70% 45%)" }, // Turquoise
  { id: "cancer-vessie", label: "Cancer de la vessie / VES / urètre", color: "hsl(320 60% 55%)" }, // Rose
  { id: "cancer-estomac", label: "Cancer de l'estomac et de l'oesophage", color: "hsl(220 65% 50%)" }, // Bleu indigo
  { id: "cancer-endometre", label: "Cancer de l'endomètre", color: "hsl(60 80% 55%)" }, // Jaune citron
  { id: "lymphome", label: "Lymphome", color: "hsl(180 60% 50%)" }, // Cyan
  { id: "llc-richter", label: "LLC & syndrome de Richter", color: "hsl(340 70% 55%)" }, // Rose foncé
];


// Fonction pour générer des données d'évolution pour toutes les pathologies
const generateEvolutionData = () => {
  const moisList = ["mai 2023", "jun. 2023", "jul. 2023", "août 2023", "sep. 2023", "oct. 2023", "nov. 2023", "déc. 2023", "jan. 2024", "fév. 2024", "mars 2024"];
  
  // Valeurs de base pour chaque pathologie (pour créer des courbes variées)
  const baseValues: Record<string, { start: number; end: number; trend: number }> = {
    "cancer-sein": { start: 6.2, end: 8.8, trend: 0.25 },
    "cancer-poumon": { start: 5.2, end: 8.4, trend: 0.29 },
    "cancer-prostate": { start: 5.8, end: 7.9, trend: 0.19 },
    "cancer-colon": { start: 4.5, end: 6.8, trend: 0.21 },
    "cancer-rectum": { start: 4.2, end: 6.2, trend: 0.18 },
    "cancer-anus": { start: 3.8, end: 5.5, trend: 0.15 },
    "cancer-rein": { start: 4.0, end: 5.9, trend: 0.17 },
    "cancer-pancreas": { start: 2.1, end: 3.0, trend: 0.08 },
    "cancer-foie": { start: 3.5, end: 5.2, trend: 0.15 },
    "cancer-vessie": { start: 4.3, end: 6.4, trend: 0.19 },
    "cancer-estomac": { start: 4.1, end: 6.1, trend: 0.18 },
    "cancer-endometre": { start: 4.4, end: 6.5, trend: 0.19 },
    "lymphome": { start: 3.2, end: 4.8, trend: 0.14 },
    "llc-richter": { start: 2.8, end: 4.2, trend: 0.13 },
  };

  return moisList.map((mois, index) => {
    const dataPoint: Record<string, number> = { mois };
    allPathologies.forEach((path) => {
      const base = baseValues[path.id];
      if (base) {
        const progress = index / (moisList.length - 1);
        // Ajouter une légère variation pour rendre les courbes plus naturelles
        const variation = Math.sin(progress * Math.PI * 2) * 0.1;
        dataPoint[path.id] = Math.round(base.start + (base.end - base.start) * progress + variation);
      }
    });
    return dataPoint;
  });
};

const evolutionData = generateEvolutionData();

// Données pour les consultations d'essais - toutes les pathologies
const consultationsData = allPathologies.map((path, index) => ({
  indication: path.label,
  consultations: Math.floor(Math.random() * 1200) + 200, // Valeurs aléatoires entre 200 et 1400
  color: path.color,
}));

// Données pour la saturation perçue - toutes les pathologies avec un pourcentage par niveau
const saturationData = allPathologies.map((path, index) => {
  // Générer un pourcentage aléatoire entre 5% et 70% pour avoir des exemples dans chaque catégorie
  // Utiliser l'index pour avoir des valeurs variées mais cohérentes
  const randomPercent = Math.floor(Math.random() * 66) + 5; // Entre 5 et 70%
  
  // Déterminer le niveau selon les règles :
  // Sous 10% → "Très Faible"
  // Entre 11% et 30% → "Faible"
  // Entre 31% et 50% → "Modérée"
  // Au-delà de 50% → "Élevée"
  let niveau: "élevée" | "modérée" | "faible" | "trèsFaible";
  if (randomPercent <= 10) {
    niveau = "trèsFaible";
  } else if (randomPercent >= 11 && randomPercent <= 30) {
    niveau = "faible";
  } else if (randomPercent >= 31 && randomPercent <= 50) {
    niveau = "modérée";
  } else {
    niveau = "élevée";
  }
  
  return {
    indication: path.label,
    niveaux: {
      élevée: niveau === "élevée" ? randomPercent : 0,
      modérée: niveau === "modérée" ? randomPercent : 0,
      faible: niveau === "faible" ? randomPercent : 0,
      trèsFaible: niveau === "trèsFaible" ? randomPercent : 0,
    },
  };
});

// Générer la config du graphique dynamiquement pour toutes les pathologies
const generateChartConfig = () => {
  const config: Record<string, { label: string; color: string }> = {};
  allPathologies.forEach((path) => {
    config[path.id] = {
      label: path.label,
      color: path.color,
    };
  });
  return config;
};

const chartConfig = generateChartConfig();

const periods = PERIODS;

const Indications = () => {
  const [selectedPathologies, setSelectedPathologies] = useState<Set<string>>(
    new Set(allPathologies.map((path) => path.id))
  );
  const [selectedPeriod, setSelectedPeriod] = useState("last-90-days");
  const [selectedPeriodEvolution, setSelectedPeriodEvolution] = useState("last-90-days");
  const [selectedPeriodSaturation, setSelectedPeriodSaturation] = useState("last-90-days");

  const togglePathology = (id: string) => {
    const newSelected = new Set(selectedPathologies);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedPathologies(newSelected);
  };

  const [filters, setFilters] = useState<FilterState>({
    indication: "all",
    region: "all",
    period: "last-90-days",
    customDateRange: { from: undefined, to: undefined },
  });

  return (
    <DashboardLayout userRole="admin">
      <PageHeader 
        title="Pathologies"
        description="Analyse détaillée des indications médicales sur le territoire national"
        actions={
          <>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <FileText className="w-4 h-4 mr-2" />
              Export PDF
            </Button>
            <Button variant="outline" className="border-orange-500 text-orange-600 hover:bg-orange-50">
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
          </>
        }
      />

      <GlobalFilters className="mb-6" onFiltersChange={setFilters} />

      <div className="space-y-6">

      {/* Graphiques du haut */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Inscription à l'essai */}
        <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-lg text-foreground">Potentiels patients</h3>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="text-blue-500 hover:text-blue-600 flex items-center">
                    <Info className="h-4 w-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">Nombre de consultations d'essais cliniques par pathologie</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-[180px] bg-background">
                <SelectValue placeholder="Période" />
              </SelectTrigger>
              <SelectContent>
                {periods.map((period) => (
                  <SelectItem key={period.value} value={period.value}>
                    {period.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            {consultationsData.map((item) => (
              <div key={item.indication} className="flex items-center gap-4">
                <div className="w-[200px] text-xs font-medium text-foreground shrink-0">
                  {item.indication}
                </div>
                <div className="flex-1 relative">
                  <div className="h-8 rounded-md flex items-center justify-end pr-2" style={{ backgroundColor: item.color, width: `${(item.consultations / 1400) * 100}%` }}>
                    <span className="text-white text-xs font-medium">{item.consultations.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Saturation Perçue */}
        <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-lg text-foreground">Saturation perçue</h3>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="text-blue-500 hover:text-blue-600">
                    <Info className="h-4 w-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">Niveau de saturation par indication, comparé aux indications similaires globales</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <Select value={selectedPeriodSaturation} onValueChange={setSelectedPeriodSaturation}>
              <SelectTrigger className="w-[180px] bg-background">
                <SelectValue placeholder="Période" />
              </SelectTrigger>
              <SelectContent>
                {periods.map((period) => (
                  <SelectItem key={period.value} value={period.value}>
                    {period.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-3">
            {/* En-tête avec les niveaux de saturation en colonnes */}
            <div className="grid grid-cols-5 gap-2 text-xs mb-2">
              <div className="text-xs font-medium text-muted-foreground">Pathologie</div>
              {[
                { label: "Très Faible", key: "trèsFaible", color: "bg-green-500" },
                { label: "Faible", key: "faible", color: "bg-yellow-500" },
                { label: "Modérée", key: "modérée", color: "bg-orange-500" },
                { label: "Élevée", key: "élevée", color: "bg-red-500" },
              ].map((col) => (
                <div key={col.key} className="text-center font-medium text-xs text-muted-foreground">
                  {col.label}
                </div>
              ))}
            </div>
            {/* Lignes avec les pathologies */}
            {saturationData.map((item) => (
              <div key={item.indication} className="grid grid-cols-5 gap-2 items-center">
                <div className="text-xs font-medium text-foreground">{item.indication}</div>
                {[
                  { label: "Très Faible", key: "trèsFaible", color: "bg-green-500" },
                  { label: "Faible", key: "faible", color: "bg-yellow-500" },
                  { label: "Modérée", key: "modérée", color: "bg-orange-500" },
                  { label: "Élevée", key: "élevée", color: "bg-red-500" },
                ].map((col) => {
                  const percent = item.niveaux[col.key as keyof typeof item.niveaux];
                  return (
                    <div
                      key={col.key}
                      className={`${col.color} rounded p-2 text-center text-white text-xs font-medium min-h-[2rem] flex items-center justify-center`}
                    >
                      {percent > 0 ? `${percent}%` : ""}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Graphique Évolution de l'intérêt médical */}
      <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-lg text-foreground">Nombre d'inscription aux essais cliniques</h3>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="text-blue-500 hover:text-blue-600">
                  <Info className="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">Mesure des inscriptions des médecins pour leurs patients aux essais cliniques</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <Select value={selectedPeriodEvolution} onValueChange={setSelectedPeriodEvolution}>
            <SelectTrigger className="w-[180px] bg-background">
              <SelectValue placeholder="Période" />
            </SelectTrigger>
            <SelectContent>
              {periods.map((period) => (
                <SelectItem key={period.value} value={period.value}>
                  {period.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-3">
            <ChartContainer config={chartConfig} className="w-full" style={{ height: `${Math.max(500, selectedPathologies.size * 35 + 150)}px` }}>
              <LineChart data={evolutionData} margin={{ top: 20, right: 40, left: 20, bottom: 40 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted/40" vertical={false} />
                <XAxis
                  dataKey="mois"
                  tickLine={false}
                  axisLine={{ stroke: "hsl(var(--border))" }}
                  tickMargin={12}
                  className="text-xs"
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis
                  tickLine={false}
                  axisLine={{ stroke: "hsl(var(--border))" }}
                  tickMargin={12}
                  className="text-xs"
                  domain={[0, 10]}
                  tick={{ fill: "hsl(var(--foreground))", fontSize: 12, fontWeight: 500 }}
                  ticks={[0, 2, 4, 6, 8, 10]}
                  width={40}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                {allPathologies.map((path) => {
                  if (!selectedPathologies.has(path.id)) return null;
                  return (
                    <Line
                      key={path.id}
                      type="monotone"
                      dataKey={path.id}
                      stroke={path.color}
                      strokeWidth={2.5}
                      dot={false}
                      activeDot={{ r: 6, strokeWidth: 2 }}
                    />
                  );
                })}
              </LineChart>
            </ChartContainer>
          </div>
          <div className="lg:col-span-1">
            <div className="space-y-3" style={{ minHeight: `${Math.max(500, selectedPathologies.size * 35 + 150)}px` }}>
              {allPathologies.map((path) => (
                <div key={path.id} className="flex items-center gap-2">
                  <Checkbox
                    id={path.id}
                    checked={selectedPathologies.has(path.id)}
                    onCheckedChange={() => togglePathology(path.id)}
                  />
                  <label
                    htmlFor={path.id}
                    className="flex items-center gap-2 text-sm cursor-pointer flex-1"
                  >
                    <div
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ backgroundColor: path.color }}
                    />
                    <span className="text-xs">{path.label}</span>
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      </div>
    </DashboardLayout>
  );
};

export default Indications;

