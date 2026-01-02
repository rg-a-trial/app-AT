import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PageHeader } from "@/components/ui/page-header";
import { GlobalFilters, FilterState } from "@/components/filters/GlobalFilters";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Building2, ArrowRight, Info, FileText, Download } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { PATHOLOGIES, PERIODS } from "@/constants/pathologies";

const indicationOptions = PATHOLOGIES.filter(p => p.value !== "all");

const centres = [
  {
    id: "chu-lille",
    name: "CHU Lille",
    indications: 7,
    rcps: 61,
  },
  {
    id: "chu-toulouse",
    name: "CHU Toulouse",
    indications: 5,
    rcps: 52,
  },
  {
    id: "hopital-bichat",
    name: "Hôpital Bichat",
    indications: 4,
    rcps: 44,
  },
  {
    id: "chu-nantes",
    name: "CHU Nantes",
    indications: 5,
    rcps: 38,
  },
  {
    id: "chu-bordeaux",
    name: "CHU Bordeaux",
    indications: 5,
    rcps: 31,
  },
];

const periods = PERIODS;

const Centres = () => {
  const [filters, setFilters] = useState<FilterState>({
    indication: "cancer-poumon",
    region: "all",
    period: "last-90-days",
    customDateRange: { from: undefined, to: undefined },
  });
  const [selectedCentre, setSelectedCentre] = useState("chu-lille");
  const [selectedPeriod, setSelectedPeriod] = useState("last-90-days");


  return (
    <DashboardLayout userRole="admin">
      <div className="space-y-6">
        <PageHeader
          title="Centres & activation"
          description="Analyse détaillée des centres et de leurs impacts sur le territoire national"
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
          {/* Centres à fort potentiel */}
          <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <h2 className="font-semibold text-lg text-foreground">
                Centres à fort potentiel
              </h2>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="text-blue-500 hover:text-blue-600 flex items-center">
                    <Info className="h-4 w-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">Liste des centres avec le plus fort potentiel d'activation pour les essais cliniques</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">Centre</TableHead>
                  <TableHead>Inscription à un essai clinique</TableHead>
                  <TableHead className="w-[150px]">RCPs</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {centres.map((centre) => (
                  <TableRow key={centre.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Building2 className="w-5 h-5 text-blue-600" />
                        <span className="font-medium text-foreground">{centre.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-foreground">
                        {centre.indications}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-foreground">
                        {centre.rcps}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="mt-4">
              <a
                href="#"
                className="text-sm text-foreground hover:underline flex items-center gap-1"
              >
                Voir tous les centres <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Filtre Centre */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-muted-foreground">Centre :</span>
              <Select value={selectedCentre} onValueChange={setSelectedCentre}>
                <SelectTrigger className="w-[250px] bg-background">
                  <SelectValue placeholder="Sélectionner un centre" />
                </SelectTrigger>
                <SelectContent>
                  {centres.map((centre) => (
                    <SelectItem key={centre.id} value={centre.id}>
                      {centre.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-muted-foreground">Période :</span>
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="w-[250px] bg-background">
                  <SelectValue placeholder="Sélectionner une période" />
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
          </div>

          {/* Indicateurs clés du centre sélectionné */}
          <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <h2 className="font-semibold text-lg text-foreground">
                Indicateurs clés du centre sélectionné
              </h2>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="text-blue-500 hover:text-blue-600 flex items-center">
                    <Info className="h-4 w-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">Métriques clés pour évaluer la performance et l'activité du centre sélectionné</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Indicateur</TableHead>
                  <TableHead>Données</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-foreground">
                        Taux d'utilisation AccessTrial
                      </span>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button className="text-blue-500 hover:text-blue-600">
                            <Info className="h-3 w-3" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">Pourcentage des essais cliniques utilisant la fonctionnalité de pré-screening AccessTrial</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-foreground">
                      67% des essais avec pré-screening réalisé
                    </span>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-foreground">
                        Évolution activité essais
                      </span>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button className="text-blue-500 hover:text-blue-600">
                            <Info className="h-3 w-3" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">Variation du nombre d'essais cliniques actifs par rapport à la période précédente</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-foreground">
                      +23% vs période précédente
                    </span>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-foreground">
                        Diversité des indications
                      </span>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button className="text-blue-500 hover:text-blue-600">
                            <Info className="h-3 w-3" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">Nombre de pathologies différentes couvertes par les essais du centre</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-foreground">
                      7 indications couvertes
                    </span>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-foreground">
                        Accès aux essais ouverts
                      </span>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button className="text-blue-500 hover:text-blue-600">
                            <Info className="h-3 w-3" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">Pourcentage des essais cliniques actuellement ouverts et accessibles</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-foreground">
                      80% des essais disponibles actuellement
                    </span>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Centres;

