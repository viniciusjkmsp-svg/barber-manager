import { useEffect, useState } from "react";
import { Layout } from "@/components/Layout";
import { Agenda } from "@/components/Agenda";
import { Professionals } from "@/components/Professionals";
import { ProductsInventory } from "@/components/ProductsInventory";
import { Clients } from "@/components/Clients";
import { Financeiro } from "@/components/Financeiro";
import { WhatsApp } from "@/components/WhatsApp";
import { Marketing } from "@/components/Marketing";
import { Relatorios } from "@/components/Relatorios";
import { Configuracoes } from "@/components/Configuracoes";
import { FollowUp } from "@/components/FollowUp";
import { Tarefas } from "@/components/Tarefas";
import { Leads } from "@/components/Leads";
import { MinhaComissao } from "@/components/MinhaComissao";
import { OwnerDashboard } from "@/components/dashboards/OwnerDashboard";
import { PartnerDashboard } from "@/components/dashboards/PartnerDashboard";
import { ManagerDashboard } from "@/components/dashboards/ManagerDashboard";
import { ReceptionDashboard } from "@/components/dashboards/ReceptionDashboard";
import { BarberDashboard } from "@/components/dashboards/BarberDashboard";
import { MarketingDashboard } from "@/components/dashboards/MarketingDashboard";
import { useProfile } from "@/context/ProfileContext";

const Index = () => {
  const { profile, navItems } = useProfile();
  const [activeTab, setActiveTab] = useState<string>(() => navItems[0]?.id ?? "dashboard");

  // Reset to first available tab when profile changes and current tab is not available
  useEffect(() => {
    if (!navItems.find((n) => n.id === activeTab)) {
      setActiveTab(navItems[0]?.id ?? "dashboard");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile.key]);

  const renderDashboard = () => {
    switch (profile.key) {
      case "proprietario":
        return <OwnerDashboard />;
      case "socia":
        return <PartnerDashboard />;
      case "gerente":
        return <ManagerDashboard />;
      case "recepcao":
        return <ReceptionDashboard />;
      case "barbeiro":
        return <BarberDashboard />;
      case "marketing":
        return <MarketingDashboard />;
      default:
        return <OwnerDashboard />;
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return renderDashboard();
      case "agenda":
        return <Agenda />;
      case "clients":
        return <Clients />;
      case "professionals":
        return <Professionals />;
      case "whatsapp":
        return <WhatsApp />;
      case "financeiro":
        return <Financeiro />;
      case "products":
        return <ProductsInventory />;
      case "marketing":
        return <Marketing />;
      case "relatorios":
        return <Relatorios />;
      case "configuracoes":
        return <Configuracoes />;
      case "followup":
        return <FollowUp />;
      case "tarefas":
        return <Tarefas />;
      case "leads":
        return <Leads />;
      case "minhacomissao":
        return <MinhaComissao />;
      default:
        return renderDashboard();
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderContent()}
    </Layout>
  );
};

export default Index;
