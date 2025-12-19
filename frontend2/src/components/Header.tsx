import { LineChart } from "lucide-react";
import paisajeBolivia from "../assets/paisaje-Bolivia.jpg";

interface HeaderProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export function Header({ activeSection, onSectionChange }: HeaderProps) {
  const sections = [
    { id: "parameters", label: "Parámetros" },
    { id: "simulation", label: "Simulación" },
    { id: "results", label: "Resultados" },
    { id: "downloads", label: "Descargas" },
    { id: "documentation", label: "Documentación" },
  ];

  return (
    <header
      className="border-b-4 border-[var(--bolivia-red)] shadow-sm relative"
      style={{
        backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0.85)), url(${paisajeBolivia})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex items-center gap-4 mb-4">
          
          <div>
            <h1 className="text-[var(--gray-900)] mb-1 drop-shadow-sm">
              Simulador Fiscal Boliviano
            </h1>
            <p className="text-[var(--gray-700)] drop-shadow-sm">
              Modelo de Incertidumbre Fiscal 2020–2025 · Análisis Estocástico de
              Deuda, Déficit y Reservas Internacionales
            </p>
          </div>
        </div>

        <nav className="flex gap-2 flex-wrap">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => onSectionChange(section.id)}
              className={`px-4 py-2 rounded-lg transition-all ${
                activeSection === section.id
                  ? "bg-[var(--bolivia-green)] text-white shadow-md"
                  : "bg-[var(--gray-100)] text-[var(--gray-700)] hover:bg-[var(--gray-200)]"
              }`}
            >
              {section.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}
