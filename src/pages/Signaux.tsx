import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PageHeader } from "@/components/ui/page-header";
import { GlobalFilters, FilterState } from "@/components/filters/GlobalFilters";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, ArrowUp, Grid3x3, ShieldCheck, ArrowRight, Info, FileText, Download } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { PATHOLOGIES, PERIODS, PATHOLOGIES_WITH_COLORS } from "@/constants/pathologies";

const indicationOptions = PATHOLOGIES;

// Données pour le graphique d'activité concurrente
const activityData = [
  { 
    mois: "oct. 2022", 
    cancerPoumon: 10, 
    carcinomeColorectal: 5.5, 
    lymphomeDiffus: 4, 
    cancerPancreas: 2.5,
    cancerSein: 8.5,
    cancerProstate: 6.2,
    cancerColon: 7.8,
    cancerRectum: 3.5,
    cancerAnus: 2.2,
    cancerRein: 5.8,
    cancerFoie: 3.2,
    cancerVessie: 4.5,
    cancerEstomac: 3.8,
    cancerEndometre: 6.5,
    llcRichter: 2.8,
  },
  { 
    mois: "sept. 2022", 
    cancerPoumon: 10.5, 
    carcinomeColorectal: 6, 
    lymphomeDiffus: 4.1, 
    cancerPancreas: 2.6,
    cancerSein: 8.8,
    cancerProstate: 6.4,
    cancerColon: 8,
    cancerRectum: 3.6,
    cancerAnus: 2.3,
    cancerRein: 6,
    cancerFoie: 3.3,
    cancerVessie: 4.6,
    cancerEstomac: 3.9,
    cancerEndometre: 6.7,
    llcRichter: 2.9,
  },
  { 
    mois: "déc. 2023", 
    cancerPoumon: 13, 
    carcinomeColorectal: 9, 
    lymphomeDiffus: 7.5, 
    cancerPancreas: 5.2,
    cancerSein: 11.2,
    cancerProstate: 8.5,
    cancerColon: 10.5,
    cancerRectum: 5.5,
    cancerAnus: 3.8,
    cancerRein: 8.2,
    cancerFoie: 5.5,
    cancerVessie: 6.8,
    cancerEstomac: 5.8,
    cancerEndometre: 9.2,
    llcRichter: 4.2,
  },
  { 
    mois: "jul. 2023", 
    cancerPoumon: 14, 
    carcinomeColorectal: 10, 
    lymphomeDiffus: 8.5, 
    cancerPancreas: 5.8,
    cancerSein: 12,
    cancerProstate: 9.2,
    cancerColon: 11.5,
    cancerRectum: 6.2,
    cancerAnus: 4.2,
    cancerRein: 9,
    cancerFoie: 6,
    cancerVessie: 7.5,
    cancerEstomac: 6.5,
    cancerEndometre: 10,
    llcRichter: 4.8,
  },
  { 
    mois: "jan. 2024", 
    cancerPoumon: 15, 
    carcinomeColorectal: 11, 
    lymphomeDiffus: 8, 
    cancerPancreas: 6,
    cancerSein: 12.8,
    cancerProstate: 9.8,
    cancerColon: 12.2,
    cancerRectum: 6.8,
    cancerAnus: 4.5,
    cancerRein: 9.5,
    cancerFoie: 6.5,
    cancerVessie: 8,
    cancerEstomac: 7,
    cancerEndometre: 10.5,
    llcRichter: 5,
  },
  { 
    mois: "mars 2024", 
    cancerPoumon: 15.5, 
    carcinomeColorectal: 11.5, 
    lymphomeDiffus: 6.5, 
    cancerPancreas: 4.5,
    cancerSein: 13.2,
    cancerProstate: 10,
    cancerColon: 12.5,
    cancerRectum: 6.5,
    cancerAnus: 4.2,
    cancerRein: 9.2,
    cancerFoie: 6.2,
    cancerVessie: 7.8,
    cancerEstomac: 6.8,
    cancerEndometre: 10.2,
    llcRichter: 4.8,
  },
  { 
    mois: "avr. 2024", 
    cancerPoumon: 15.8, 
    carcinomeColorectal: 11.8, 
    lymphomeDiffus: 6.2, 
    cancerPancreas: 4.2,
    cancerSein: 13.5,
    cancerProstate: 10.2,
    cancerColon: 12.8,
    cancerRectum: 6.2,
    cancerAnus: 4,
    cancerRein: 9,
    cancerFoie: 6,
    cancerVessie: 7.5,
    cancerEstomac: 6.5,
    cancerEndometre: 10,
    llcRichter: 4.5,
  },
];

const indications = [
  {
    id: "cancer-poumon",
    label: "Cancer du poumon",
    color: "hsl(195 66% 54%)",
    icon: "Z",
    indications: 7,
    trend: "↑",
    rcps: 51,
    progressSegments: ["green", "green", "green", "green"],
    scoreConfiance: 9,
  },
  {
    id: "carcinome-colorectal",
    label: "Carcinome colorectal",
    color: "hsl(142 76% 46%)",
    icon: "e",
    indications: 11,
    trend: null,
    rcps: 52,
    progressSegments: ["green", "green", "green", "yellow"],
    scoreConfiance: 8,
  },
  {
    id: "lymphome-diffus",
    label: "Lymphome diffus",
    color: "hsl(30 100% 55%)",
    icon: "●",
    indications: 8,
    trend: null,
    rcps: 44,
    progressSegments: ["orange", "orange", "orange", "orange"],
    scoreConfiance: 6,
  },
  {
    id: "cancer-pancreas",
    label: "Cancer du pancréas",
    color: "hsl(0 84% 60%)",
    icon: "▲",
    indications: 5,
    trend: null,
    rcps: 38,
    progressSegments: ["orange", "orange", "orange", "orange"],
    scoreConfiance: 5,
  },
  {
    id: "cancer-sein",
    label: "Cancer du sein",
    color: "hsl(280 65% 55%)",
    icon: "S",
    indications: 9,
    trend: null,
    rcps: 48,
    progressSegments: ["green", "green", "green", "green"],
    scoreConfiance: 8,
  },
  {
    id: "cancer-prostate",
    label: "Cancer de la prostate",
    color: "hsl(200 70% 50%)",
    icon: "P",
    indications: 6,
    trend: null,
    rcps: 42,
    progressSegments: ["green", "green", "green", "yellow"],
    scoreConfiance: 7,
  },
  {
    id: "cancer-colon",
    label: "Cancer du colon",
    color: "hsl(45 100% 60%)",
    icon: "C",
    indications: 10,
    trend: null,
    rcps: 49,
    progressSegments: ["green", "green", "green", "yellow"],
    scoreConfiance: 7,
  },
  {
    id: "cancer-rectum",
    label: "Cancer du rectum",
    color: "hsl(320 60% 55%)",
    icon: "R",
    indications: 4,
    trend: null,
    rcps: 35,
    progressSegments: ["orange", "orange", "orange", "yellow"],
    scoreConfiance: 6,
  },
  {
    id: "cancer-anus",
    label: "Cancer de l'anus",
    color: "hsl(15 90% 50%)",
    icon: "A",
    indications: 3,
    trend: null,
    rcps: 28,
    progressSegments: ["orange", "orange", "orange", "orange"],
    scoreConfiance: 4,
  },
  {
    id: "cancer-rein",
    label: "Cancer du rein",
    color: "hsl(160 70% 45%)",
    icon: "K",
    indications: 6,
    trend: null,
    rcps: 40,
    progressSegments: ["green", "green", "green", "orange"],
    scoreConfiance: 6,
  },
  {
    id: "cancer-foie",
    label: "Cancer du foie et des voies biliaires",
    color: "hsl(60 80% 55%)",
    icon: "F",
    indications: 4,
    trend: null,
    rcps: 32,
    progressSegments: ["orange", "orange", "orange", "yellow"],
    scoreConfiance: 5,
  },
  {
    id: "cancer-vessie",
    label: "Cancer de la vessie / VES / urètre",
    color: "hsl(220 65% 50%)",
    icon: "V",
    indications: 5,
    trend: null,
    rcps: 36,
    progressSegments: ["orange", "orange", "orange", "yellow"],
    scoreConfiance: 5,
  },
  {
    id: "cancer-estomac",
    label: "Cancer de l'estomac et de l'oesophage",
    color: "hsl(180 60% 50%)",
    icon: "E",
    indications: 4,
    trend: null,
    rcps: 33,
    progressSegments: ["orange", "orange", "orange", "orange"],
    scoreConfiance: 5,
  },
  {
    id: "cancer-endometre",
    label: "Cancer de l'endomètre",
    color: "hsl(340 70% 55%)",
    icon: "D",
    indications: 7,
    trend: null,
    rcps: 45,
    progressSegments: ["green", "green", "green", "yellow"],
    scoreConfiance: 7,
  },
  {
    id: "llc-richter",
    label: "LLC & syndrome de Richter",
    color: "hsl(270 65% 55%)",
    icon: "L",
    indications: 3,
    trend: null,
    rcps: 26,
    progressSegments: ["orange", "orange", "orange", "orange"],
    scoreConfiance: 4,
  },
];

const pathologiesEnHausse = [
  {
    id: "cancer-sein",
    label: "Cancer du sein",
    trend: "+18%",
  },
  {
    id: "cancer-poumon",
    label: "Cancer du poumon",
    trend: "+15%",
  },
  {
    id: "cancer-prostate",
    label: "Cancer de la prostate",
    trend: "+12%",
  },
];

const periods = PERIODS;

const classesTherapeutiquesConcurrentielles = [
  {
    id: "cancer-anus",
    label: "Cancer de l'anus",
    trend: "+25%",
  },
  {
    id: "cancer-rectum",
    label: "Cancer du rectum",
    trend: "+20%",
  },
  {
    id: "cancer-pancreas",
    label: "Cancer du pancréas",
    trend: "+18%",
  },
];

// Liste de toutes les pathologies avec leurs couleurs pour le graphique
const allPathologiesForChart = [
  { id: "cancerPoumon", label: "Cancer du poumon", color: "hsl(195 66% 54%)" },
  { id: "carcinomeColorectal", label: "Carcinome colorectal", color: "hsl(142 76% 46%)" },
  { id: "lymphomeDiffus", label: "Lymphome diffus", color: "hsl(30 100% 55%)" },
  { id: "cancerPancreas", label: "Cancer du pancréas", color: "hsl(0 84% 60%)" },
  { id: "cancerSein", label: "Cancer du sein", color: "hsl(280 65% 55%)" },
  { id: "cancerProstate", label: "Cancer de la prostate", color: "hsl(200 70% 50%)" },
  { id: "cancerColon", label: "Cancer du colon", color: "hsl(45 100% 60%)" },
  { id: "cancerRectum", label: "Cancer du rectum", color: "hsl(320 60% 55%)" },
  { id: "cancerAnus", label: "Cancer de l'anus", color: "hsl(15 90% 50%)" },
  { id: "cancerRein", label: "Cancer du rein", color: "hsl(160 70% 45%)" },
  { id: "cancerFoie", label: "Cancer du foie et des voies biliaires", color: "hsl(60 80% 55%)" },
  { id: "cancerVessie", label: "Cancer de la vessie / VES / urètre", color: "hsl(220 65% 50%)" },
  { id: "cancerEstomac", label: "Cancer de l'estomac et de l'oesophage", color: "hsl(180 60% 50%)" },
  { id: "cancerEndometre", label: "Cancer de l'endomètre", color: "hsl(340 70% 55%)" },
  { id: "llcRichter", label: "LLC & syndrome de Richter", color: "hsl(270 65% 55%)" },
];

const saturationData = [
  { elevée: 45, moderee: 30, faible: 25, trend: "↑45%" },
  { elevée: 40, moderee: 35, faible: 25, trend: "↑33%" },
  { elevée: 35, moderee: 40, faible: 25, trend: "↑18%" },
  { elevée: 30, moderee: 35, faible: 35, trend: "↑4%" },
];

const chartConfig = {
  cancerPoumon: {
    label: "Cancer du poumon",
    color: "hsl(195 66% 54%)",
  },
  carcinomeColorectal: {
    label: "Carcinome colorectal",
    color: "hsl(142 76% 46%)",
  },
  lymphomeDiffus: {
    label: "Lymphome diffus",
    color: "hsl(30 100% 55%)",
  },
  cancerPancreas: {
    label: "Cancer du pancréas",
    color: "hsl(0 84% 60%)",
  },
  cancerSein: {
    label: "Cancer du sein",
    color: "hsl(280 65% 55%)",
  },
  cancerProstate: {
    label: "Cancer de la prostate",
    color: "hsl(200 70% 50%)",
  },
  cancerColon: {
    label: "Cancer du colon",
    color: "hsl(45 100% 60%)",
  },
  cancerRectum: {
    label: "Cancer du rectum",
    color: "hsl(320 60% 55%)",
  },
  cancerAnus: {
    label: "Cancer de l'anus",
    color: "hsl(15 90% 50%)",
  },
  cancerRein: {
    label: "Cancer du rein",
    color: "hsl(160 70% 45%)",
  },
  cancerFoie: {
    label: "Cancer du foie et des voies biliaires",
    color: "hsl(60 80% 55%)",
  },
  cancerVessie: {
    label: "Cancer de la vessie / VES / urètre",
    color: "hsl(220 65% 50%)",
  },
  cancerEstomac: {
    label: "Cancer de l'estomac et de l'oesophage",
    color: "hsl(180 60% 50%)",
  },
  cancerEndometre: {
    label: "Cancer de l'endomètre",
    color: "hsl(340 70% 55%)",
  },
  llcRichter: {
    label: "LLC & syndrome de Richter",
    color: "hsl(270 65% 55%)",
  },
};

const Signaux = () => {
  const [filters, setFilters] = useState<FilterState>({
    indication: "all",
    region: "all",
    period: "last-90-days",
    customDateRange: { from: undefined, to: undefined },
  });
  const [selectedPathologies, setSelectedPathologies] = useState<Set<string>>(
    new Set(allPathologiesForChart.map((path) => path.id))
  );

  const togglePathology = (id: string) => {
    const newSelected = new Set(selectedPathologies);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedPathologies(newSelected);
  };

  const getColorClass = (color: string) => {
    switch (color) {
      case "green":
        return "bg-green-500";
      case "yellow":
        return "bg-yellow-500";
      case "orange":
        return "bg-orange-500";
      case "red":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getDominantColor = (segments: string[]) => {
    const counts: Record<string, number> = {};
    segments.forEach((color) => {
      counts[color] = (counts[color] || 0) + 1;
    });
    
    let maxCount = 0;
    let dominantColor = segments[0];
    
    Object.entries(counts).forEach(([color, count]) => {
      if (count > maxCount) {
        maxCount = count;
        dominantColor = color;
      }
    });
    
    return dominantColor;
  };

  const getSaturationPercentage = (indications: number) => {
    // Calculer un pourcentage basé sur le nombre d'essais
    // Exemple : 7 essais = 70%, 11 essais = 73%, etc.
    // On multiplie par 10 pour obtenir un pourcentage approximatif
    return Math.min(100, indications * 10);
  };

  const getSaturationColor = (percentage: number) => {
    if (percentage > 80) {
      return "hsl(0 84% 60%)"; // Rouge
    } else if (percentage >= 60 && percentage <= 80) {
      return "hsl(30 100% 55%)"; // Orange
    } else if (percentage >= 40 && percentage < 60) {
      return "hsl(45 100% 60%)"; // Jaune
    } else {
      return "hsl(142 76% 46%)"; // Vert
    }
  };

  return (
    <DashboardLayout userRole="admin">
      <div className="space-y-6">
        <PageHeader
          title="Signaux concurrentiels"
          description="Analyse détaillée des essais cliniques de vos concurrents sur le territoire national"
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

        {/* Contenu principal */}
        <div className="space-y-6">
          {/* Classe thérapeutique et Saturation Perçue - Côte à côte */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Classe thérapeutique à la hausse */}
            <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <h3 className="font-semibold text-lg text-foreground">
                  Classe thérapeutique à la hausse
                </h3>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button className="text-blue-500 hover:text-blue-600 flex items-center">
                      <Info className="h-4 w-4" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">Classes thérapeutiques montrant une croissance significative du potentiel marché</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <div className="space-y-3">
                {pathologiesEnHausse.map((pathology) => {
                  return (
                    <div key={pathology.id} className="flex items-center gap-3">
                      <span className="text-sm text-foreground flex-1">{pathology.label}</span>
                      <span className="text-sm font-semibold text-green-600">
                        {pathology.trend}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Saturation Perçue */}
            <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <h3 className="font-semibold text-lg text-foreground">Saturation perçue</h3>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button className="text-blue-500 hover:text-blue-600 flex items-center">
                      <Info className="h-4 w-4" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">Niveau de saturation perçu du marché par essai clinique, indiquant la compétitivité et la disponibilité des opportunités</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <div className="space-y-3">
                {classesTherapeutiquesConcurrentielles.map((classe) => {
                  return (
                    <div key={classe.id} className="flex items-center gap-3">
                      <span className="text-sm text-foreground flex-1">{classe.label}</span>
                      <span className="text-sm font-semibold text-red-600">
                        {classe.trend}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Activité concurrente par essai clinique */}
          <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <h2 className="font-semibold text-lg text-foreground">
                  Activité concurrente par essai clinique
                </h2>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button className="text-blue-500 hover:text-blue-600 flex items-center">
                      <Info className="h-4 w-4" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">Évolution temporelle de l'activité concurrentielle par essai clinique, montrant les tendances d'engagement des compétiteurs</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              <div className="lg:col-span-3">
                <ChartContainer config={chartConfig} className="w-full" style={{ height: `${Math.max(500, selectedPathologies.size * 35 + 150)}px` }}>
                  <LineChart data={activityData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" />
                    <XAxis
                      dataKey="mois"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      className="text-xs"
                      tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                    />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      className="text-xs"
                      domain={[0, 18]}
                      tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    {allPathologiesForChart.map((path) => {
                      if (!selectedPathologies.has(path.id)) return null;
                      return (
                        <Line
                          key={path.id}
                          type="monotone"
                          dataKey={path.id}
                          stroke={path.color}
                          strokeWidth={2}
                          dot={false}
                          activeDot={{ r: 5 }}
                        />
                      );
                    })}
                  </LineChart>
                </ChartContainer>
              </div>
              <div className="lg:col-span-1">
                <div className="space-y-3" style={{ minHeight: `${Math.max(500, selectedPathologies.size * 35 + 150)}px` }}>
                  {allPathologiesForChart.map((path) => (
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

          {/* Niveau de saturation vis-à-vis de la concurrence */}
          <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <h3 className="font-semibold text-lg text-foreground">
                Niveau de saturation vis-à-vis de la concurrence
              </h3>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="text-blue-500 hover:text-blue-600 flex items-center">
                    <Info className="h-4 w-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">Niveau de saturation vis-à-vis de la concurrence : Évalue le niveau de saturation du marché par pathologie en fonction du nombre de patients potentiels et d'essais en cours par la concurrence, cela donne un niveau en %.</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <div className="space-y-2">
              {indications.map((indication) => {
                const saturationPercentage = getSaturationPercentage(indication.indications);
                const saturationColor = getSaturationColor(saturationPercentage);
                
                return (
                  <div key={indication.id} className="flex items-center gap-4">
                    <div className="w-[200px] text-xs font-medium text-foreground shrink-0">
                      {indication.label}
                    </div>
                    <div className="flex-1 relative">
                      <div 
                        className="h-8 rounded-md flex items-center justify-end pr-2" 
                        style={{ 
                          backgroundColor: saturationColor, 
                          width: `${saturationPercentage}%` 
                        }}
                      >
                        <span className="text-white text-xs font-medium">
                          {saturationPercentage}%
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default Signaux;

