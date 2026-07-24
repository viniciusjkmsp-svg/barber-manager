import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Dashboard } from "@/components/Dashboard";
import { DailyControl } from "@/components/DailyControl";
import { WeeklyView } from "@/components/WeeklyView";
import { MonthlyView } from "@/components/MonthlyView";
import { Agenda } from "@/components/Agenda";
import { Professionals } from "@/components/Professionals";
import { ProsthesisSales } from "@/components/ProsthesisSales";
import { ProductsInventory } from "@/components/ProductsInventory";
import { SubscriptionPlans } from "@/components/SubscriptionPlans";

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard />;
      case "daily":
        return <DailyControl />;
      case "weekly":
        return <WeeklyView />;
      case "monthly":
        return <MonthlyView />;
      case "professionals":
        return <Professionals />;
      case "prosthesis":
        return <ProsthesisSales />;
      case "products":
        return <ProductsInventory />;
      case "plans":
        return <SubscriptionPlans />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
        {renderContent()}
      </Layout>
    </div>
  );
};

export default Index;