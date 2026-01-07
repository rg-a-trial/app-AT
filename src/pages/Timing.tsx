import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PageHeader } from "@/components/ui/page-header";
import { GlobalFilters, FilterState } from "@/components/filters/GlobalFilters";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  Stethoscope,
  FileEdit,
  Microscope,
  MessageCircle,
  ArrowRight,
  Info,
  FileText,
  ChevronRight,
  ArrowUp,
  Shield,
  Download,
} from "lucide-react";
import { PATHOLOGIES, PERIODS } from "@/constants/pathologies";

const indicationOptions = PATHOLOGIES.filter(p => p.value !== "all");
const periods = PERIODS.filter(p => p.value !== "custom");

const pathologies = [
  {
    id: "lymphome",
    label: "Lymphome",
    segments: [
      { color: "blue", width: 20, days: 12 },
      { color: "orange", width: 30, days: 18 },
      { color: "light-blue", width: 25, days: 15 },
      { color: "red", width: 25, days: 15 },
    ],
  },
  {
    id: "cancer-prostate",
    label: "Cancer de la Prostate",
    segments: [
      { color: "blue", width: 25, days: 15 },
      { color: "orange", width: 35, days: 21 },
      { color: "light-blue", width: 20, days: 12 },
      { color: "red", width: 20, days: 12 },
    ],
  },
  {
    id: "myelome",
    label: "Myélome Multiple",
    segments: [
      { color: "blue", width: 15, days: 9 },
      { color: "orange", width: 40, days: 24 },
      { color: "light-blue", width: 30, days: 18 },
      { color: "red", width: 15, days: 9 },
    ],
  },
  {
    id: "leucemie",
    label: "Leucémie",
    segments: [
      { color: "blue", width: 30, days: 18 },
      { color: "orange", width: 25, days: 15 },
      { color: "light-blue", width: 25, days: 15 },
      { color: "red", width: 20, days: 12 },
    ],
  },
  {
    id: "cancer-poumon",
    label: "Cancer du Poumon",
    segments: [
      { color: "blue", width: 18, days: 11 },
      { color: "orange", width: 32, days: 19 },
      { color: "light-blue", width: 28, days: 17 },
      { color: "red", width: 22, days: 13 },
    ],
  },
  {
    id: "tumeur-solide-rare",
    label: "Tumeur solide rare",
    segments: [
      { color: "blue", width: 22, days: 13 },
      { color: "orange", width: 28, days: 17 },
      { color: "light-blue", width: 30, days: 18 },
      { color: "red", width: 20, days: 12 },
    ],
  },
  {
    id: "sarcome",
    label: "Sarcome",
    segments: [
      { color: "blue", width: 20, days: 12 },
      { color: "orange", width: 30, days: 18 },
      { color: "light-blue", width: 28, days: 17 },
      { color: "red", width: 22, days: 13 },
    ],
  },
  {
    id: "cancer-sein",
    label: "Cancer du Sein",
    segments: [
      { color: "blue", width: 25, days: 15 },
      { color: "orange", width: 30, days: 18 },
      { color: "light-blue", width: 25, days: 15 },
      { color: "red", width: 20, days: 12 },
    ],
  },
  {
    id: "cancer-colorectal",
    label: "Cancer Colorectal",
    segments: [
      { color: "blue", width: 20, days: 12 },
      { color: "orange", width: 35, days: 21 },
      { color: "light-blue", width: 25, days: 15 },
      { color: "red", width: 20, days: 12 },
    ],
  },
];

const missedTrials = [
  {
    id: "chu-lille",
    name: "CHU Lille",
    count: 2,
    month: "Décembre",
    trend: "right",
  },
  {
    id: "chu-strasbourg",
    name: "CHU Strasbourg",
    count: 2,
    month: "Décembre",
    trend: "right",
  },
  {
    id: "hcl-lyon",
    name: "Hospices Civils de Lyon",
    count: 1,
    month: "Novembre",
    trend: "right",
  },
  {
    id: "iuct-oncopole",
    name: "IUCT-Oncopole",
    count: 1,
    month: "Novembre",
    trend: "right",
  },
];

const Timing = () => {
  const [filters, setFilters] = useState<FilterState>({
    indication: "cancer-poumon",
    region: "all",
    period: "last-90-days",
    customDateRange: { from: undefined, to: undefined },
  });

  const getColorClass = (color: string) => {
    switch (color) {
      case "blue":
        return "bg-blue-200";
      case "orange":
        return "bg-orange-200";
      case "light-blue":
        return "bg-sky-200";
      case "red":
        return "bg-red-200";
      default:
        return "bg-gray-300";
    }
  };

  return (
    <DashboardLayout userRole="admin">
      <div className="space-y-6">
        <PageHeader
          title="Recrutements"
          description="Analyse détaillées des recrutements sur le territoire national"
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

        {/* Cartes de métriques */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Délai diagnostic → discussion essais */}
          <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Délai diagnostic → discussion essais
                </h3>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button className="text-blue-500 hover:text-blue-600">
                      <Info className="h-3 w-3" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">Temps moyen entre le diagnostic et la discussion d'un essai clinique</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <p className="text-3xl font-bold text-foreground">34 jours</p>
              <p className="text-xs text-muted-foreground mt-1">en moyenne</p>
            </div>
            <div className="flex items-center gap-1 text-xs text-green-600">
              <ArrowUp className="w-3 h-3" />
              <span>2 jours</span>
            </div>
          </div>

          {/* Critère d'éligibilité trop complexe */}
          <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Critère d'éligibilité jugés trop complexe
                </h3>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button className="text-blue-500 hover:text-blue-600">
                      <Info className="h-3 w-3" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">Nombre d'essais cliniques non disponibles en raison de critères d'éligibilité trop complexes</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <p className="text-3xl font-bold text-foreground">142 essais</p>
            </div>
            <div className="flex items-center gap-1 text-xs text-green-600">
              <ArrowUp className="w-3 h-3" />
              <span>12 essais cliniques</span>
            </div>
          </div>

          {/* Essais manqués */}
          <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Critère d'inéligibilité jugés trop complexe
                </h3>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button className="text-blue-500 hover:text-blue-600">
                      <Info className="h-3 w-3" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">Nombre d'essais cliniques non disponibles en raison de critères d'inéligibilité trop complexes</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <p className="text-3xl font-bold text-foreground">245 essais</p>
            </div>
            <div className="flex items-center gap-1 text-xs text-green-600">
              <ArrowUp className="w-3 h-3" />
              <span>4 essais cliniques</span>
            </div>
          </div>
        </div>

        {/* Bouton voir l'analyse détaillée */}
        <div className="flex justify-end">
          <Button className="bg-orange-500 hover:bg-orange-600">
            voir l'analyse détaillée
          </Button>
        </div>

        {/* Contenu principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Colonne gauche - Parcours Patient */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-6">
                  <h2 className="font-semibold text-lg text-foreground">
                    Détail du parcours patient
                  </h2>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button className="text-blue-500 hover:text-blue-600 flex items-center">
                        <Info className="h-4 w-4" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">Visualisation du parcours patient et du moment où les essais cliniques sont envisagés selon les pathologies</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>

              {/* Timeline */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                      <Stethoscope className="w-6 h-6 text-blue-600" />
                    </div>
                    <span className="text-xs font-medium text-foreground">Analyse</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
                      <FileEdit className="w-6 h-6 text-orange-600" />
                    </div>
                    <span className="text-xs font-medium text-foreground">Diagnostic</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 rounded-full bg-blue-200 flex items-center justify-center">
                      <Microscope className="w-6 h-6 text-blue-400" />
                    </div>
                    <span className="text-xs font-medium text-foreground">RCP</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                      <MessageCircle className="w-6 h-6 text-red-600" />
                    </div>
                    <span className="text-xs font-medium text-foreground">Inscription à l'essai</span>
                  </div>
                </div>
              </div>

              {/* Liste des pathologies avec barres */}
              <div className="space-y-3">
                {pathologies.map((pathology) => (
                  <div key={pathology.id} className="space-y-1">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="font-medium text-foreground">{pathology.label}</span>
                    </div>
                    <div className="flex items-center gap-1 h-6 bg-muted rounded overflow-hidden relative">
                      {pathology.segments.map((segment, idx) => (
                        <div
                          key={idx}
                          className={`h-full ${getColorClass(segment.color)} relative flex items-center justify-center`}
                          style={{ width: `${segment.width}%` }}
                        >
                          {segment.days && (
                            <span className="text-xs font-medium text-black">
                              {segment.days} jours
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>

          {/* Colonne droite - Essais manqués */}
          <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <h3 className="font-semibold text-lg text-foreground">
                Difficultés dans les recrutements
              </h3>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="text-blue-500 hover:text-blue-600 flex items-center">
                    <Info className="h-4 w-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">Liste des essais cliniques manqués par les centres en raison de critères d'éligibilités ou d'inégibilités trop complexes</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <div className="space-y-4">
              {missedTrials.map((trial) => (
                <div
                  key={trial.id}
                  className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/30"
                >
                  <div className="flex-1">
                    <p className="font-medium text-sm text-foreground">{trial.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {trial.count} essai{trial.count > 1 ? "s" : ""} en {trial.month}
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">
              Voir liste complète
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Timing;

