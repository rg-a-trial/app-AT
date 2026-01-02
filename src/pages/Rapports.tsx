import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { GlobalFilters, FilterState } from "@/components/filters/GlobalFilters";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { FileText, Download, BarChart3, Shield, ArrowUp, Lightbulb } from "lucide-react";

// Données pour le graphique Snapshot Mensuel
const snapshotData = [
  { mois: "oct. 2022", valeur1: 10, valeur2: 5.5, valeur3: 4, valeur4: 2.5 },
  { mois: "nov. 2022", valeur1: 10.5, valeur2: 6, valeur3: 4.1, valeur4: 2.6 },
  { mois: "déc. 2022", valeur1: 11, valeur2: 6.5, valeur3: 4.5, valeur4: 2.8 },
  { mois: "jan. 2023", valeur1: 11.5, valeur2: 7, valeur3: 5, valeur4: 3 },
  { mois: "fév. 2023", valeur1: 12, valeur2: 7.5, valeur3: 5.5, valeur4: 3.5 },
  { mois: "mars 2023", valeur1: 12.5, valeur2: 8, valeur3: 6, valeur4: 4 },
  { mois: "avr. 2023", valeur1: 13, valeur2: 8.5, valeur3: 6.5, valeur4: 4.5 },
  { mois: "mai 2023", valeur1: 13.5, valeur2: 9, valeur3: 7, valeur4: 5 },
  { mois: "jun. 2023", valeur1: 14, valeur2: 9.5, valeur3: 7.5, valeur4: 5.2 },
  { mois: "jul. 2023", valeur1: 14.5, valeur2: 10, valeur3: 8, valeur4: 5.5 },
  { mois: "août 2023", valeur1: 15, valeur2: 10.5, valeur3: 8.5, valeur4: 5.8 },
  { mois: "sep. 2023", valeur1: 15.2, valeur2: 11, valeur3: 8.2, valeur4: 5.5 },
  { mois: "oct. 2023", valeur1: 15.5, valeur2: 11.2, valeur3: 7.8, valeur4: 5.2 },
  { mois: "nov. 2023", valeur1: 15.8, valeur2: 11.5, valeur3: 7.5, valeur4: 5 },
  { mois: "déc. 2023", valeur1: 16, valeur2: 11.8, valeur3: 7.2, valeur4: 4.8 },
  { mois: "jan. 2024", valeur1: 16.5, valeur2: 12, valeur3: 7, valeur4: 4.5 },
  { mois: "fév. 2024", valeur1: 16.8, valeur2: 12.2, valeur3: 6.8, valeur4: 4.3 },
  { mois: "mars 2024", valeur1: 17, valeur2: 12.5, valeur3: 6.5, valeur4: 4.2 },
  { mois: "avr. 2024", valeur1: 17.2, valeur2: 12.8, valeur3: 6.2, valeur4: 4 },
];

const chartConfig = {
  valeur1: {
    label: "Valeur 1",
    color: "hsl(195 66% 54%)",
  },
  valeur2: {
    label: "Valeur 2",
    color: "hsl(142 76% 46%)",
  },
  valeur3: {
    label: "Valeur 3",
    color: "hsl(30 100% 55%)",
  },
  valeur4: {
    label: "Valeur 4",
    color: "hsl(0 84% 60%)",
  },
};

const Rapports = () => {
  const [filters, setFilters] = useState<FilterState>({
    indication: "all",
    region: "all",
    period: "last-90-days",
    customDateRange: { from: undefined, to: undefined },
  });
  const [selectedView, setSelectedView] = useState("last-3-months");

  return (
    <DashboardLayout userRole="admin">
      <div className="space-y-6">
        {/* En-tête */}
        <div className="space-y-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Rapports & exports</h1>
            <p className="text-sm text-muted-foreground mt-2">
              Exportez vos données-clés.
            </p>
          </div>

        <GlobalFilters className="mb-6" onFiltersChange={setFilters} />

        {/* Boutons d'export */}
        <div className="flex items-center gap-3">
          <Button className="bg-blue-600 hover:bg-blue-700">
            <FileText className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
          <Button variant="outline" className="border-orange-500 text-orange-600 hover:bg-orange-50">
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>
        </div>

        {/* Contenu principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Colonne gauche - Snapshot Mensuel */}
          <div className="lg:col-span-2 space-y-6">
            {/* Graphique Snapshot Mensuel */}
            <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="font-semibold text-lg text-foreground">Avril 2024</h2>
                  <p className="text-xs text-muted-foreground">Mis à jour il y a 3 jours</p>
                </div>
              </div>
              <ChartContainer config={chartConfig} className="h-64 w-full">
                <LineChart data={snapshotData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" />
                  <XAxis
                    dataKey="mois"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    className="text-xs"
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
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
                  <Line
                    type="monotone"
                    dataKey="valeur1"
                    stroke="hsl(195 66% 54%)"
                    strokeWidth={2}
                    dot={{ fill: "hsl(195 66% 54%)", r: 3 }}
                    activeDot={{ r: 5 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="valeur2"
                    stroke="hsl(142 76% 46%)"
                    strokeWidth={2}
                    dot={{ fill: "hsl(142 76% 46%)", r: 3 }}
                    activeDot={{ r: 5 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="valeur3"
                    stroke="hsl(30 100% 55%)"
                    strokeWidth={2}
                    dot={{ fill: "hsl(30 100% 55%)", r: 3 }}
                    activeDot={{ r: 5 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="valeur4"
                    stroke="hsl(0 84% 60%)"
                    strokeWidth={2}
                    dot={{ fill: "hsl(0 84% 60%)", r: 3 }}
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ChartContainer>
            </div>

            {/* Cartes de résumé Snapshot Mensuel */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-card rounded-lg border border-border p-4 shadow-sm">
                <div className="flex items-start gap-3">
                  <BarChart3 className="w-5 h-5 text-blue-600 mt-1" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm text-foreground mb-1">Snapshot Mensuel</h3>
                    <p className="text-xs text-muted-foreground mb-2">Mis à jour il y a 3 jours</p>
                    <p className="text-xs text-foreground">
                      +200 patients/mois / 1 indication compétitive identifiée / Opportunités au
                      Nord-Est
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-card rounded-lg border border-border p-4 shadow-sm">
                <div className="flex items-start gap-3">
                  <BarChart3 className="w-5 h-5 text-blue-600 mt-1" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm text-foreground mb-1">Snapshot Mensuel</h3>
                    <p className="text-xs text-muted-foreground mb-2">Mis à jour il y a 3 jours</p>
                    <p className="text-xs text-foreground">
                      +12% essais concurrents / +15% activité RCP / Croissance Immuno-oncol.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Colonne droite - AccessTrial Strategic Overview */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Shield className="w-6 h-6 text-blue-600" />
                <span className="font-bold text-blue-900">AccessTrial</span>
              </div>
              <span className="text-xs font-semibold text-blue-700">Nasé</span>
            </div>

            <div className="mb-6">
              <h2 className="text-2xl font-bold text-blue-900 mb-1">STRATEGIC OVERVIEW</h2>
              <p className="text-sm text-blue-700">Cancer du Poumon</p>
              <p className="text-xs text-blue-600 mt-1">Q3 2024</p>
            </div>

            {/* Métriques */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="bg-white/80 rounded-lg p-3 border border-blue-200">
                <div className="flex items-center gap-2 mb-1">
                  <Shield className="w-4 h-4 text-blue-600" />
                  <span className="text-lg font-bold text-blue-900">8.4</span>
                </div>
                <p className="text-xs text-blue-700">Score Médical</p>
              </div>
              <div className="bg-white/80 rounded-lg p-3 border border-blue-200">
                <div className="flex items-center gap-2 mb-1">
                  <ArrowUp className="w-4 h-4 text-blue-600" />
                  <span className="text-lg font-bold text-blue-900">N essais</span>
                </div>
                <p className="text-xs text-blue-700">Trée. Famle</p>
              </div>
              <div className="bg-white/80 rounded-lg p-3 border border-blue-200">
                <div className="flex items-center gap-2 mb-1">
                  <Lightbulb className="w-4 h-4 text-blue-600" />
                  <span className="text-lg font-bold text-blue-900">2,450/mois</span>
                </div>
                <p className="text-xs text-blue-700">+1 Reemes</p>
              </div>
              <div className="bg-white/80 rounded-lg p-3 border border-blue-200">
                <div className="flex items-center gap-2 mb-1">
                  <Lightbulb className="w-4 h-4 text-blue-600" />
                  <span className="text-lg font-bold text-blue-900">63%</span>
                </div>
                <p className="text-xs text-blue-700">Part de marché globale</p>
              </div>
            </div>

            {/* Placeholder pour graphique */}
            <div className="bg-white/60 rounded-lg p-4 border border-blue-200">
              <div className="space-y-2">
                <div className="h-2 bg-blue-200 rounded w-full"></div>
                <div className="h-2 bg-blue-200 rounded w-3/4"></div>
                <div className="h-2 bg-blue-200 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer/Barre de résumé */}
        <div className="bg-card rounded-lg border border-border p-4 shadow-sm">
          <p className="text-sm text-foreground">
            +18% d'essais actifs en Immuno-oncologie depuis 3 mois / Saturation élevée pour le
            Cancer du poumon
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Rapports;

