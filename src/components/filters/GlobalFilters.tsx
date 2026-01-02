import { useState } from "react";
import { Filter, X, CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { fr } from "date-fns/locale/fr";

interface GlobalFiltersProps {
  onFiltersChange?: (filters: FilterState) => void;
  className?: string;
}

export interface FilterState {
  indication: string;
  region: string;
  period: string;
  customDateRange?: { from: Date | undefined; to: Date | undefined };
}

const indications = [
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
];

const regions = [
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
];

const periods = [
  { value: "last-30-days", label: "30 derniers jours" },
  { value: "last-90-days", label: "90 derniers jours" },
  { value: "last-6-months", label: "6 derniers mois" },
  { value: "last-12-months", label: "12 derniers mois" },
  { value: "custom", label: "Date personnalisée" },
];

export function GlobalFilters({ onFiltersChange, className }: GlobalFiltersProps) {
  const [filters, setFilters] = useState<FilterState>({
    indication: "all",
    region: "all",
    period: "last-90-days",
    customDateRange: { from: undefined, to: undefined },
  });

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    const newFilters = { ...filters, [key]: value };
    if (key === "period" && value !== "custom") {
      newFilters.customDateRange = { from: undefined, to: undefined };
    }
    setFilters(newFilters);
    onFiltersChange?.(newFilters);
  };

  const handleDateRangeChange = (range: { from: Date | undefined; to: Date | undefined }) => {
    const newFilters = {
      ...filters,
      period: "custom",
      customDateRange: range,
    };
    setFilters(newFilters);
    onFiltersChange?.(newFilters);
  };

  const resetFilters = () => {
    const defaultFilters = {
      indication: "all",
      region: "all",
      period: "last-90-days",
      customDateRange: { from: undefined, to: undefined },
    };
    setFilters(defaultFilters);
    onFiltersChange?.(defaultFilters);
  };

  const hasActiveFilters =
    filters.indication !== "all" ||
    filters.region !== "all" ||
    (filters.period === "custom" && (filters.customDateRange?.from || filters.customDateRange?.to));

  const getDateRangeDisplay = () => {
    if (filters.period !== "custom" || !filters.customDateRange) {
      return "Date personnalisée";
    }
    const { from, to } = filters.customDateRange;
    if (from && to) {
      return `${format(from, "dd/MM/yyyy", { locale: fr })} - ${format(to, "dd/MM/yyyy", { locale: fr })}`;
    }
    if (from) {
      return `À partir du ${format(from, "dd/MM/yyyy", { locale: fr })}`;
    }
    return "Date personnalisée";
  };

  return (
    <div className={cn("flex flex-wrap items-center gap-3 p-4 bg-card rounded-lg border border-border", className)}>
      <div className="flex items-center gap-2 text-muted-foreground">
        <Filter className="h-4 w-4" />
        <span className="text-sm font-medium">Filtres</span>
      </div>

      <Select value={filters.indication} onValueChange={(v) => handleFilterChange("indication", v)}>
        <SelectTrigger className="w-[250px] bg-background">
          <SelectValue placeholder="Indication" />
        </SelectTrigger>
        <SelectContent>
          {indications.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={filters.region} onValueChange={(v) => handleFilterChange("region", v)}>
        <SelectTrigger className="w-[220px] bg-background">
          <SelectValue placeholder="Région" />
        </SelectTrigger>
        <SelectContent>
          {regions.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={filters.period} onValueChange={(v) => handleFilterChange("period", v)}>
        <SelectTrigger className="w-[180px] bg-background">
          <SelectValue placeholder="Période" />
        </SelectTrigger>
        <SelectContent>
          {periods.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {filters.period === "custom" && (
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-[240px] justify-start text-left font-normal bg-background",
                !filters.customDateRange?.from && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {getDateRangeDisplay()}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="range"
              selected={{
                from: filters.customDateRange?.from,
                to: filters.customDateRange?.to,
              }}
              onSelect={(range) => handleDateRangeChange(range || { from: undefined, to: undefined })}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
      )}

      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={resetFilters}
          className="text-muted-foreground hover:text-foreground"
        >
          <X className="h-4 w-4 mr-1" />
          Réinitialiser
        </Button>
      )}
    </div>
  );
}
