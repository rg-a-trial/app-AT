import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PageHeader } from "@/components/ui/page-header";
import { GlobalFilters, FilterState } from "@/components/filters/GlobalFilters";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts";
import { Map, Info, FileText, Download } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { PATHOLOGIES, PERIODS } from "@/constants/pathologies";

const indicationOptions = PATHOLOGIES.filter(p => p.value !== "all");

// Toutes les régions de France avec des valeurs réalistes
const regions = [
  { id: "ile-de-france", label: "Île-de-France", value: 815, trend: 55, color: "green" },
  { id: "auvergne-rhone-alpes", label: "Auvergne-Rhône-Alpes", value: 634, trend: 42, color: "green" },
  { id: "nouvelle-aquitaine", label: "Nouvelle-Aquitaine", value: 520, trend: 35, color: "green" },
  { id: "occitanie", label: "Occitanie", value: 480, trend: 32, color: "green" },
  { id: "hauts-de-france", label: "Hauts-de-France", value: 380, trend: -12, color: "green" },
  { id: "grand-est", label: "Grand Est", value: 351, trend: 28, color: "orange" },
  { id: "provence-alpes-cote-azur", label: "Provence-Alpes-Côte d'Azur", value: 340, trend: -8, color: "orange" },
  { id: "pays-de-la-loire", label: "Pays de la Loire", value: 280, trend: 20, color: "orange" },
  { id: "normandie", label: "Normandie", value: 260, trend: 18, color: "orange" },
  { id: "bretagne", label: "Bretagne", value: 240, trend: 16, color: "yellow" },
  { id: "centre-val-de-loire", label: "Centre-Val de Loire", value: 220, trend: -5, color: "yellow" },
  { id: "bourgogne-franche-comte", label: "Bourgogne-Franche-Comté", value: 192, trend: 15, color: "red" },
  { id: "corse", label: "Corse", value: 85, trend: 8, color: "red" },
];

// Calculer le maximum pour normaliser les barres
const maxValue = Math.max(...regions.map(r => r.value));

// Données pour l'évolution temporelle - par région
const evolutionData = regions.map((region) => ({
  region: region.label,
  profils: region.value,
  saturation: Math.floor(region.value * 0.85), // Saturation environ 85% des profils
}));

const chartConfig = {
  profils: {
    label: "Profils éligibles",
    color: "hsl(0 0% 0%)",
  },
  saturation: {
    label: "Saturation",
    color: "hsl(0 84% 60%)",
  },
};

const periods = PERIODS.filter(p => p.value !== "custom");

const Territoires = () => {
  const [filters, setFilters] = useState<FilterState>({
    indication: "cancer-poumon",
    region: "all",
    period: "last-90-days",
    customDateRange: { from: undefined, to: undefined },
  });

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


  return (
    <DashboardLayout userRole="admin">
      <PageHeader 
        title="Territoires"
        description="Analyse détaillée des essais cliniques par géographie sur le territoire national"
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

      {/* Évolution temporelle */}
      <div className="bg-card rounded-lg border border-border p-6 shadow-sm mb-6">
        <div className="flex items-center gap-2 mb-4">
          <h3 className="font-semibold text-lg text-foreground">Évolution temporelle</h3>
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="text-blue-500 hover:text-blue-600 flex items-center">
                <Info className="h-4 w-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs">Évolution dans le temps des profils éligibles et de la saturation par région</p>
            </TooltipContent>
          </Tooltip>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-3">
            <ChartContainer config={chartConfig} className="h-64 w-full min-h-[300px]">
              <LineChart 
                data={evolutionData} 
                margin={{ top: 5, right: 30, left: 0, bottom: 80 }}
              >
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" />
                <XAxis
                  dataKey="region"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  className="text-xs"
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
                  interval={0}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  className="text-xs"
                  domain={[0, maxValue]}
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  type="monotone"
                  dataKey="profils"
                  stroke="hsl(0 0% 0%)"
                  strokeWidth={2}
                  dot={{ fill: "hsl(0 0% 0%)", r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="saturation"
                  stroke="hsl(0 84% 60%)"
                  strokeWidth={2}
                  dot={{ fill: "hsl(0 84% 60%)", r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ChartContainer>
          </div>
          <div className="lg:col-span-1">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-black rounded"></div>
                <span className="text-sm">Profils éligibles</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-500 rounded"></div>
                <span className="text-sm">Saturation</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section principale avec liste des régions et carte */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profils éligibles par région */}
        <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <h3 className="font-semibold text-lg text-foreground">Profils éligibles par région</h3>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="text-blue-500 hover:text-blue-600 flex items-center">
                  <Info className="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">Nombre de profils éligibles pour les essais cliniques par région</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <div className="space-y-4">
            {regions.map((region) => {
              // Calculer le pourcentage de remplissage basé sur la valeur réelle
              const fillPercentage = (region.value / maxValue) * 100;
              // Déterminer la couleur de la barre : rouge si value < 210, sinon utiliser region.color
              const barColor = region.value < 210 ? "red" : region.color;
              
              return (
                <div key={region.id} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-foreground">{region.label}</span>
                    <span className={region.trend > 0 ? "text-green-600 font-semibold" : "text-red-600 font-semibold"}>
                      {region.trend > 0 ? "↑" : "↓"}{Math.abs(region.trend)}%
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-8 bg-muted rounded overflow-hidden relative">
                      <div
                        className={`h-full ${getColorClass(barColor)}`}
                        style={{ width: `${fillPercentage}%` }}
                      />
                    </div>
                    <span className="font-semibold text-foreground min-w-[60px] text-right">
                      {region.value}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
          {/* Légende */}
          <div className="mt-4 flex flex-wrap gap-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-600 rounded"></div>
              <span>Élevée</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-500 rounded"></div>
              <span>Modérée</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-orange-500 rounded"></div>
              <span>Faible</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded"></div>
              <span>Très faible</span>
            </div>
          </div>
        </div>

        {/* Carte de France */}
        <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <h3 className="font-semibold text-lg text-foreground">Carte des opportunités</h3>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="text-blue-500 hover:text-blue-600 flex items-center">
                  <Info className="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">Visualisation géographique des opportunités d'essais cliniques par région</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <div className="relative bg-muted rounded-lg h-[500px] flex items-center justify-center">
            <Map className="w-24 h-24 text-muted-foreground" />
          </div>
          {/* Légende */}
          <div className="mt-4 flex flex-wrap gap-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-600 rounded"></div>
              <span>Élevée</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-500 rounded"></div>
              <span>Modérée</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-orange-500 rounded"></div>
              <span>Faible</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded"></div>
              <span>Très faible</span>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Territoires;

