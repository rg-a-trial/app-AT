import { useState, useMemo } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PageHeader } from "@/components/ui/page-header";
import { KPICard } from "@/components/ui/kpi-card";
import { AlertBanner } from "@/components/ui/alert-banner";
import { GlobalFilters, FilterState } from "@/components/filters/GlobalFilters";
import { Activity, Users, TrendingUp, CheckCircle, Info, FileText, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid } from "recharts";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { PATHOLOGIES, REGIONS } from "@/constants/pathologies";

const chartConfig = {
  intérêt: {
    label: "Intérêt médical (%)",
    color: "hsl(195 66% 54%)", // Couleur du menu sidebar-primary
  },
};

// Fonction pour générer des données basées sur les filtres
function generateData(filters: FilterState) {
  // Générer un hash simple basé sur les filtres pour avoir des données cohérentes mais variées
  const hash = `${filters.indication}-${filters.region}-${filters.period}`.length;
  
  // Base de données pour chaque pathologie
  const baseData: Record<string, { intérêt: number; potentiel: number; concurrence: number; faisabilité: number }> = {
    "cancer-sein": { intérêt: 92, potentiel: 1250, concurrence: 3, faisabilité: 88 },
    "cancer-poumon": { intérêt: 88, potentiel: 980, concurrence: 4, faisabilité: 85 },
    "cancer-prostate": { intérêt: 85, potentiel: 750, concurrence: 2, faisabilité: 82 },
    "cancer-colon": { intérêt: 79, potentiel: 580, concurrence: 3, faisabilité: 78 },
    "cancer-rectum": { intérêt: 76, potentiel: 450, concurrence: 2, faisabilité: 75 },
    "cancer-anus": { intérêt: 72, potentiel: 380, concurrence: 1, faisabilité: 72 },
    "cancer-rein": { intérêt: 73, potentiel: 420, concurrence: 2, faisabilité: 74 },
    "cancer-pancreas": { intérêt: 76, potentiel: 450, concurrence: 3, faisabilité: 75 },
    "cancer-foie": { intérêt: 74, potentiel: 400, concurrence: 2, faisabilité: 73 },
    "cancer-vessie": { intérêt: 77, potentiel: 520, concurrence: 2, faisabilité: 76 },
    "cancer-estomac": { intérêt: 75, potentiel: 480, concurrence: 3, faisabilité: 74 },
    "cancer-endometre": { intérêt: 78, potentiel: 550, concurrence: 2, faisabilité: 77 },
    "lymphome": { intérêt: 82, potentiel: 620, concurrence: 3, faisabilité: 80 },
    "llc-richter": { intérêt: 70, potentiel: 380, concurrence: 2, faisabilité: 69 },
  };

  // Base de données pour chaque région (modificateurs)
  const regionModifiers: Record<string, { intérêt: number; potentiel: number }> = {
    "ile-de-france": { intérêt: 1.15, potentiel: 1.3 },
    "auvergne-rhone-alpes": { intérêt: 1.1, potentiel: 1.2 },
    "provence-alpes-cote-azur": { intérêt: 1.08, potentiel: 1.15 },
    "nouvelle-aquitaine": { intérêt: 1.05, potentiel: 1.1 },
    "occitanie": { intérêt: 1.05, potentiel: 1.1 },
    "hauts-de-france": { intérêt: 1.03, potentiel: 1.05 },
    "grand-est": { intérêt: 1.02, potentiel: 1.05 },
    "normandie": { intérêt: 1.0, potentiel: 1.0 },
    "bretagne": { intérêt: 0.98, potentiel: 0.95 },
    "pays-de-la-loire": { intérêt: 0.97, potentiel: 0.95 },
    "centre-val-de-loire": { intérêt: 0.95, potentiel: 0.9 },
    "bourgogne-franche-comte": { intérêt: 0.95, potentiel: 0.9 },
    "corse": { intérêt: 0.9, potentiel: 0.8 },
  };

  // Calculer les valeurs de base
  let baseIntérêt = 78;
  let basePotentiel = 2450;
  let baseConcurrence = 3;
  let baseFaisabilité = 85;

  if (filters.indication !== "all") {
    const data = baseData[filters.indication];
    if (data) {
      baseIntérêt = data.intérêt;
      basePotentiel = data.potentiel;
      baseConcurrence = data.concurrence;
      baseFaisabilité = data.faisabilité;
    }
  } else {
    // Moyenne de toutes les pathologies
    const values = Object.values(baseData);
    baseIntérêt = Math.round(values.reduce((acc, v) => acc + v.intérêt, 0) / values.length);
    basePotentiel = Math.round(values.reduce((acc, v) => acc + v.potentiel, 0) / values.length);
    baseConcurrence = Math.round(values.reduce((acc, v) => acc + v.concurrence, 0) / values.length);
    baseFaisabilité = Math.round(values.reduce((acc, v) => acc + v.faisabilité, 0) / values.length);
  }

  // Appliquer les modificateurs de région
  if (filters.region !== "all") {
    const modifier = regionModifiers[filters.region];
    if (modifier) {
      baseIntérêt = Math.round(baseIntérêt * modifier.intérêt);
      basePotentiel = Math.round(basePotentiel * modifier.potentiel);
    }
  }

  // Ajouter une variation basée sur le hash pour rendre les données plus dynamiques
  const variation = (hash % 10) - 5; // Variation de -5 à +5
  baseIntérêt = Math.max(50, Math.min(100, baseIntérêt + variation));
  basePotentiel = Math.max(200, basePotentiel + variation * 50);

  // Générer les données d'évolution (12 derniers mois)
  const evolutionData = Array.from({ length: 12 }, (_, i) => {
    const mois = ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Août", "Sep", "Oct", "Nov", "Déc"];
    const baseValue = baseIntérêt - 20 + (i * 2) + (hash % 5);
    return {
      mois: mois[i],
      intérêt: Math.max(50, Math.min(100, baseValue)),
    };
  });

  // Générer les top indications (filtrées si une pathologie est sélectionnée)
  const allIndications = PATHOLOGIES.filter(p => p.value !== "all").map(p => ({
    indication: p.label,
    value: p.value,
  }));

  // Régions par défaut pour chaque indication (rotation pour varier)
  const defaultRegions = REGIONS.filter(r => r.value !== "all").map(r => r.label);

  let topIndications = allIndications.map((ind, index) => {
    const data = baseData[ind.value];
    const regionMod = filters.region !== "all" ? regionModifiers[filters.region] : { intérêt: 1, potentiel: 1 };
    const intérêt = Math.round((data?.intérêt || 75) * regionMod.intérêt);
    const potentiel = Math.round((data?.potentiel || 500) * regionMod.potentiel);
    
    let priorité = "Modérée";
    if (intérêt >= 85) priorité = "Très haute";
    else if (intérêt >= 75) priorité = "Haute";

    // Si une région est sélectionnée, l'utiliser, sinon utiliser une région par défaut
    const région = filters.region !== "all" 
      ? REGIONS.find(r => r.value === filters.region)?.label || "Toutes les régions"
      : defaultRegions[index % defaultRegions.length];

    return {
      rang: index + 1,
      indication: ind.indication,
      région,
      intérêt,
      potentiel,
      priorité,
    };
  });

  // Si une pathologie spécifique est sélectionnée, la mettre en premier
  if (filters.indication !== "all") {
    const selectedInd = allIndications.find(ind => ind.value === filters.indication);
    if (selectedInd) {
      const data = baseData[filters.indication];
      const regionMod = filters.region !== "all" ? regionModifiers[filters.region] : { intérêt: 1, potentiel: 1 };
      const intérêt = Math.round(data.intérêt * regionMod.intérêt);
      const potentiel = Math.round(data.potentiel * regionMod.potentiel);
      
      let priorité = "Modérée";
      if (intérêt >= 85) priorité = "Très haute";
      else if (intérêt >= 75) priorité = "Haute";

      const région = filters.region !== "all" 
        ? REGIONS.find(r => r.value === filters.region)?.label || "Toutes les régions"
        : defaultRegions[0];

      topIndications = [
        {
          rang: 1,
          indication: selectedInd.indication,
          région,
          intérêt,
          potentiel,
          priorité,
        },
        ...topIndications.filter(ind => ind.indication !== selectedInd.indication).slice(0, 7).map((ind, idx) => ({
          ...ind,
          région: filters.region !== "all" 
            ? REGIONS.find(r => r.value === filters.region)?.label || ind.région
            : defaultRegions[(idx + 1) % defaultRegions.length],
        })),
      ].map((ind, index) => ({ ...ind, rang: index + 1 }));
    }
  }

  // Trier par intérêt décroissant
  topIndications.sort((a, b) => b.intérêt - a.intérêt);
  topIndications = topIndications.map((ind, index) => ({ ...ind, rang: index + 1 }));

  return {
    kpi: {
      intérêt: baseIntérêt,
      potentiel: basePotentiel,
      concurrence: baseConcurrence,
      faisabilité: baseFaisabilité,
    },
    evolution: evolutionData,
    topIndications: topIndications.slice(0, 8),
  };
}

function EvolutionChart({ data }: { data: Array<{ mois: string; intérêt: number }> }) {
  const chartColor = "hsl(195 66% 54%)"; // Couleur du menu sidebar-primary
  
  return (
    <div className="w-full overflow-hidden relative">
      <ChartContainer config={chartConfig} className="h-64 sm:h-72 w-full">
        <AreaChart 
          data={data} 
          margin={{ top: 20, right: 25, left: 5, bottom: 20 }}
        >
          <defs>
            <linearGradient id="gradientIntérêt" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={chartColor} stopOpacity={0.5} />
              <stop offset="30%" stopColor={chartColor} stopOpacity={0.35} />
              <stop offset="70%" stopColor={chartColor} stopOpacity={0.15} />
              <stop offset="100%" stopColor={chartColor} stopOpacity={0} />
            </linearGradient>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceAlpha" stdDeviation="3"/>
              <feOffset dx="0" dy="2" result="offsetblur"/>
              <feComponentTransfer>
                <feFuncA type="linear" slope="0.3"/>
              </feComponentTransfer>
              <feMerge>
                <feMergeNode/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke="hsl(var(--muted-foreground))"
            strokeOpacity={0.2}
            vertical={false}
          />
          <XAxis
            dataKey="mois"
            tickLine={false}
            axisLine={false}
            tickMargin={12}
            className="text-[10px] sm:text-xs"
            interval="preserveStartEnd"
            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11, fontWeight: 500 }}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tickMargin={12}
            className="text-[10px] sm:text-xs"
            domain={[0, 100]}
            width={45}
            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11, fontWeight: 500 }}
          />
          <ChartTooltip 
            content={<ChartTooltipContent />}
            cursor={{ stroke: chartColor, strokeWidth: 1.5, strokeDasharray: "4 4", opacity: 0.4 }}
          />
          <Area
            type="basis"
            dataKey="intérêt"
            stroke={chartColor}
            strokeWidth={0}
            fill="url(#gradientIntérêt)"
            fillOpacity={1}
            style={{ 
              filter: "drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1))",
            }}
            activeDot={{ 
              r: 6, 
              fill: chartColor,
              strokeWidth: 2,
              stroke: "hsl(var(--background))",
              style: { filter: "drop-shadow(0 0 8px " + chartColor + ")" }
            }}
          />
        </AreaChart>
      </ChartContainer>
    </div>
  );
}

function TopIndicationsTable({ data }: { data: Array<{ rang: number; indication: string; région: string; intérêt: number; potentiel: number; priorité: string }> }) {
  const getPriorityColor = (priorité: string): string => {
    if (priorité === "Très haute") return "bg-red-500 text-white";
    if (priorité === "Haute") return "bg-orange-500 text-white";
    return "bg-yellow-500 text-white";
  };

  return (
    <div className="w-full">
      <div className="overflow-x-auto rounded-md border border-border/50">
        <Table className="min-w-full">
          <TableHeader className="bg-muted/50 backdrop-blur-sm z-10 border-b">
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-12 sm:w-16 font-semibold text-xs sm:text-sm">Rang</TableHead>
              <TableHead className="min-w-[140px] sm:min-w-[180px] font-semibold text-xs sm:text-sm">Pathologie</TableHead>
              <TableHead className="min-w-[140px] sm:min-w-[160px] font-semibold text-xs sm:text-sm">Région</TableHead>
              <TableHead className="text-right min-w-[80px] font-semibold text-xs sm:text-sm">Faisabilité globale</TableHead>
              <TableHead className="text-right min-w-[110px] sm:min-w-[130px] font-semibold text-xs sm:text-sm">Priorité</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item.rang} className="hover:bg-muted/30 transition-colors border-b border-border/30">
                <TableCell className="font-medium text-xs sm:text-sm py-3">{item.rang}</TableCell>
                <TableCell className="text-xs sm:text-sm py-3">
                  <span className="block">{item.indication}</span>
                </TableCell>
                <TableCell className="text-xs sm:text-sm py-3">
                  <span className="block text-muted-foreground">{item.région}</span>
                </TableCell>
                <TableCell className="text-right font-semibold text-xs sm:text-sm py-3">{item.intérêt}%</TableCell>
                <TableCell className="text-right py-3">
                  <Badge className={`text-[10px] sm:text-xs px-2 py-0.5 ${getPriorityColor(item.priorité)}`}>
                    {item.priorité}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

const Index = () => {
  const [filters, setFilters] = useState<FilterState>({
    indication: "all",
    region: "all",
    period: "last-90-days",
    customDateRange: { from: undefined, to: undefined },
  });

  const data = useMemo(() => generateData(filters), [filters]);

  // Obtenir le nom de la pathologie et de la région pour l'AlertBanner
  const pathologieLabel = filters.indication !== "all" 
    ? PATHOLOGIES.find(ind => ind.value === filters.indication)?.label || "pathologie sélectionnée"
    : "Cancer du sein";
  
  const regionLabel = filters.region !== "all"
    ? REGIONS.find(reg => reg.value === filters.region)?.label || "région sélectionnée"
    : "Île-de-France";

  // Déterminer la direction de la tendance basée sur les variations
  const getTrendDirection = (current: number, base: number): 'up' | 'down' | 'neutral' => {
    const diff = current - base;
    if (diff > 3) return 'up';
    if (diff < -3) return 'down';
    return 'neutral';
  };

  const baseIntérêt = 78;
  const basePotentiel = 2450;
  const trendIntérêt = data.kpi.intérêt - baseIntérêt;
  const trendPotentiel = Math.round((data.kpi.potentiel - basePotentiel) / 50);

  return (
    <DashboardLayout userRole="admin">
      <PageHeader 
        title="Vue d'ensemble"
        description="Synthèse détaillée de vos données sur le Dashboard d'AccessTrial"
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

      <AlertBanner
        variant="warning"
        title="Voici où vous devez regarder en priorité"
        description={`La pathologie "${pathologieLabel}" en ${regionLabel} montre un fort intérêt médical avec une saturation faible.`}
        action={{ label: "Voir les détails", onClick: () => {} }}
        className="mb-6"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <KPICard
          title="Intérêt médical"
          value={`${data.kpi.intérêt}%`}
          subtitle="Score global"
          icon={<Activity className="h-5 w-5" />}
          trend={{ value: Math.abs(trendIntérêt), direction: getTrendDirection(data.kpi.intérêt, baseIntérêt) }}
          tooltip="Mesure de l'intérêt des médecins lors des RCPs"
        />
        <KPICard
          title="Potentiel patients"
          value={data.kpi.potentiel.toLocaleString()}
          subtitle="Patients éligibles estimés"
          icon={<Users className="h-5 w-5" />}
          trend={{ value: Math.abs(trendPotentiel), direction: getTrendDirection(data.kpi.potentiel, basePotentiel) }}
          tooltip="Estimation du nombre de patients pouvant bénéficier d'un essai"
        />
        <KPICard
          title="Niveau de concurrence"
          value={data.kpi.concurrence === 1 ? "Faible" : data.kpi.concurrence === 2 ? "Modéré" : data.kpi.concurrence >= 4 ? "Élevé" : "Modéré"}
          subtitle={`${data.kpi.concurrence} essai${data.kpi.concurrence > 1 ? 's' : ''} actif${data.kpi.concurrence > 1 ? 's' : ''}`}
          icon={<TrendingUp className="h-5 w-5" />}
          trend={{ value: data.kpi.concurrence - 3, direction: 'neutral' }}
          tooltip="Nombre d'essais concurrents sur les mêmes indications"
        />
        <KPICard
          title="Faisabilité globale"
          value={`${data.kpi.faisabilité}%`}
          subtitle="Score composite"
          icon={<CheckCircle className="h-5 w-5" />}
          trend={{ value: Math.abs(data.kpi.faisabilité - 85), direction: getTrendDirection(data.kpi.faisabilité, 85) }}
          tooltip="Score combinant intérêt médical, potentiel patients et niveau de concurrence"
          variant="success"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
        <div className="bg-card rounded-lg border border-border p-4 sm:p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4 sm:mb-6">
            <h3 className="font-semibold text-lg text-foreground">Évolution des essais cliniques</h3>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="text-blue-500 hover:text-blue-600 flex items-center">
                  <Info className="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">Évolution temporelle du nombre d'essais cliniques actifs</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <div className="w-full overflow-hidden">
            <EvolutionChart data={data.evolution} />
          </div>
        </div>
        <div className="bg-card rounded-lg border border-border p-4 sm:p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4 sm:mb-6">
            <h3 className="font-semibold text-lg text-foreground">Top indications prioritaires</h3>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="text-blue-500 hover:text-blue-600 flex items-center">
                  <Info className="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">Liste des pathologies présentant le plus fort intérêt médical et le moins d'essais concurrents</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <TopIndicationsTable data={data.topIndications} />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Index;
