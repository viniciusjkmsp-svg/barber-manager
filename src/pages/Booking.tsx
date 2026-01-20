import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { BookingAuth } from "@/components/booking/BookingAuth";
import { BookingCategory } from "@/components/booking/BookingCategory";
import { BookingProfessional } from "@/components/booking/BookingProfessional";
import { BookingService } from "@/components/booking/BookingService";
import { BookingDateTime } from "@/components/booking/BookingDateTime";
import { BookingConfirmation } from "@/components/booking/BookingConfirmation";
import { BookingReceipt } from "@/components/booking/BookingReceipt";
import { BookingProgress } from "@/components/booking/BookingProgress";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home } from "lucide-react";
import type { User, Session } from "@supabase/supabase-js";

export interface BookingData {
  categoryId: string | null;
  categoryName: string | null;
  professionalId: string | null;
  professionalName: string | null;
  serviceId: string | null;
  serviceName: string | null;
  servicePrice: number | null;
  appointmentDate: Date | null;
  appointmentTime: string | null;
  appointmentId: string | null;
}

const Booking = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
  const [bookingData, setBookingData] = useState<BookingData>({
    categoryId: null,
    categoryName: null,
    professionalId: null,
    professionalName: null,
    serviceId: null,
    serviceName: null,
    servicePrice: null,
    appointmentDate: null,
    appointmentTime: null,
    appointmentId: null,
  });

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user && currentStep === 1) {
          setCurrentStep(2);
        }
        setLoading(false);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        setCurrentStep(2);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, 7));
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const updateBookingData = (data: Partial<BookingData>) => {
    setBookingData((prev) => ({ ...prev, ...data }));
  };

  const resetBooking = () => {
    setBookingData({
      categoryId: null,
      categoryName: null,
      professionalId: null,
      professionalName: null,
      serviceId: null,
      serviceName: null,
      servicePrice: null,
      appointmentDate: null,
      appointmentTime: null,
      appointmentId: null,
    });
    setCurrentStep(2);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <BookingAuth onSuccess={handleNext} />;
      case 2:
        return (
          <BookingCategory
            onSelect={(id, name) => {
              updateBookingData({ categoryId: id, categoryName: name });
              handleNext();
            }}
          />
        );
      case 3:
        return (
          <BookingProfessional
            categoryId={bookingData.categoryId}
            onSelect={(id, name) => {
              updateBookingData({ professionalId: id, professionalName: name });
              handleNext();
            }}
            onBack={handleBack}
          />
        );
      case 4:
        return (
          <BookingService
            professionalId={bookingData.professionalId}
            onSelect={(id, name, price) => {
              updateBookingData({ serviceId: id, serviceName: name, servicePrice: price });
              handleNext();
            }}
            onBack={handleBack}
          />
        );
      case 5:
        return (
          <BookingDateTime
            professionalId={bookingData.professionalId}
            serviceId={bookingData.serviceId}
            onSelect={(date, time) => {
              updateBookingData({ appointmentDate: date, appointmentTime: time });
              handleNext();
            }}
            onBack={handleBack}
          />
        );
      case 6:
        return (
          <BookingConfirmation
            bookingData={bookingData}
            user={user}
            onConfirm={(appointmentId) => {
              updateBookingData({ appointmentId });
              handleNext();
            }}
            onBack={handleBack}
          />
        );
      case 7:
        return (
          <BookingReceipt
            bookingData={bookingData}
            onNewBooking={resetBooking}
          />
        );
      default:
        return <BookingAuth onSuccess={handleNext} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      <div className="container max-w-2xl mx-auto py-8 px-4">
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/")}
            className="gap-2"
          >
            <Home className="h-4 w-4" />
            Início
          </Button>
          
          <h1 className="text-2xl font-bold text-foreground">
            Agendar Horário
          </h1>
          
          <div className="w-20" />
        </div>

        <BookingProgress currentStep={currentStep} />

        <div className="mt-8">
          {renderStep()}
        </div>
      </div>
    </div>
  );
};

export default Booking;