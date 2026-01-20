-- Tabela de categorias de serviço (Barbearia/Salão)
CREATE TABLE public.service_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de profissionais
CREATE TABLE public.professionals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  initials TEXT NOT NULL,
  color TEXT NOT NULL DEFAULT 'bg-blue-600',
  category_id UUID REFERENCES public.service_categories(id),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de serviços
CREATE TABLE public.services (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  code TEXT NOT NULL UNIQUE,
  price DECIMAL(10,2) NOT NULL,
  duration_minutes INTEGER NOT NULL DEFAULT 30,
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de relacionamento profissional-serviço
CREATE TABLE public.professional_services (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  professional_id UUID NOT NULL REFERENCES public.professionals(id) ON DELETE CASCADE,
  service_id UUID NOT NULL REFERENCES public.services(id) ON DELETE CASCADE,
  UNIQUE(professional_id, service_id)
);

-- Tabela de perfis de clientes
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de agendamentos
CREATE TABLE public.appointments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  professional_id UUID NOT NULL REFERENCES public.professionals(id),
  service_id UUID NOT NULL REFERENCES public.services(id),
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  notes TEXT,
  total_price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(professional_id, appointment_date, appointment_time)
);

-- Tabela de horários de trabalho dos profissionais
CREATE TABLE public.professional_schedules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  professional_id UUID NOT NULL REFERENCES public.professionals(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  UNIQUE(professional_id, day_of_week)
);

-- Habilitar RLS em todas as tabelas
ALTER TABLE public.service_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.professionals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.professional_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.professional_schedules ENABLE ROW LEVEL SECURITY;

-- Políticas para service_categories (público para leitura)
CREATE POLICY "Categorias são públicas para leitura" ON public.service_categories FOR SELECT USING (true);

-- Políticas para professionals (público para leitura)
CREATE POLICY "Profissionais são públicos para leitura" ON public.professionals FOR SELECT USING (is_active = true);

-- Políticas para services (público para leitura)
CREATE POLICY "Serviços são públicos para leitura" ON public.services FOR SELECT USING (is_active = true);

-- Políticas para professional_services (público para leitura)
CREATE POLICY "Relacionamento profissional-serviço é público" ON public.professional_services FOR SELECT USING (true);

-- Políticas para professional_schedules (público para leitura)
CREATE POLICY "Horários são públicos para leitura" ON public.professional_schedules FOR SELECT USING (is_active = true);

-- Políticas para profiles
CREATE POLICY "Usuários podem ver seu próprio perfil" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Usuários podem criar seu próprio perfil" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Usuários podem atualizar seu próprio perfil" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);

-- Políticas para appointments
CREATE POLICY "Clientes podem ver seus próprios agendamentos" ON public.appointments FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = appointments.client_id AND profiles.user_id = auth.uid())
);
CREATE POLICY "Clientes podem criar agendamentos" ON public.appointments FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = client_id AND profiles.user_id = auth.uid())
);
CREATE POLICY "Clientes podem atualizar seus agendamentos" ON public.appointments FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = appointments.client_id AND profiles.user_id = auth.uid())
);
CREATE POLICY "Clientes podem cancelar seus agendamentos" ON public.appointments FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = appointments.client_id AND profiles.user_id = auth.uid())
);

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_professionals_updated_at BEFORE UPDATE ON public.professionals FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON public.appointments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Inserir dados iniciais de categorias
INSERT INTO public.service_categories (name, description, icon) VALUES
  ('Barbearia', 'Serviços de barbearia masculina', 'scissors'),
  ('Salão', 'Serviços de salão de beleza', 'sparkles'),
  ('Manicure', 'Serviços de manicure e pedicure', 'hand');

-- Inserir serviços
INSERT INTO public.services (name, code, price, duration_minutes, description) VALUES
  ('Corte', 'corte', 35.00, 30, 'Corte de cabelo masculino'),
  ('Barba', 'barba', 20.00, 20, 'Aparar e modelar a barba'),
  ('Sobrancelha', 'sobrancelha', 15.00, 15, 'Design de sobrancelha'),
  ('Luzes', 'luzes', 120.00, 90, 'Mechas e luzes no cabelo'),
  ('Alisamento', 'alisamento', 150.00, 120, 'Alisamento capilar'),
  ('Botox', 'botox', 80.00, 60, 'Tratamento capilar com botox'),
  ('Manicure', 'manicure', 30.00, 45, 'Cuidados com as unhas das mãos');

-- Inserir profissionais com categoria
INSERT INTO public.professionals (name, role, initials, color, category_id) VALUES
  ('Marcos Macedo', 'Barbeiro', 'MM', 'bg-blue-600', (SELECT id FROM public.service_categories WHERE name = 'Barbearia')),
  ('Junior Silva', 'Barbeiro', 'JS', 'bg-green-600', (SELECT id FROM public.service_categories WHERE name = 'Barbearia')),
  ('Cristiano Marques', 'Barbeiro', 'CM', 'bg-cyan-600', (SELECT id FROM public.service_categories WHERE name = 'Barbearia')),
  ('Claudio Carvalho', 'Barbeiro', 'CC', 'bg-amber-600', (SELECT id FROM public.service_categories WHERE name = 'Barbearia')),
  ('Silvia Gomes', 'Cabeleireira', 'SG', 'bg-red-600', (SELECT id FROM public.service_categories WHERE name = 'Salão')),
  ('Nélia', 'Manicure', 'N', 'bg-gray-600', (SELECT id FROM public.service_categories WHERE name = 'Manicure')),
  ('Irani', 'Manicure', 'I', 'bg-slate-700', (SELECT id FROM public.service_categories WHERE name = 'Manicure'));

-- Inserir relacionamento profissional-serviço
INSERT INTO public.professional_services (professional_id, service_id)
SELECT p.id, s.id FROM public.professionals p, public.services s
WHERE (p.name = 'Marcos Macedo' AND s.code IN ('corte', 'barba', 'sobrancelha'))
   OR (p.name = 'Junior Silva' AND s.code IN ('corte', 'barba', 'alisamento'))
   OR (p.name = 'Cristiano Marques' AND s.code IN ('corte', 'barba', 'botox'))
   OR (p.name = 'Claudio Carvalho' AND s.code IN ('corte', 'barba', 'luzes'))
   OR (p.name = 'Silvia Gomes' AND s.code IN ('luzes', 'alisamento', 'botox'))
   OR (p.name = 'Nélia' AND s.code = 'manicure')
   OR (p.name = 'Irani' AND s.code = 'manicure');

-- Inserir horários de trabalho padrão (Segunda a Sábado, 9h às 19h)
INSERT INTO public.professional_schedules (professional_id, day_of_week, start_time, end_time)
SELECT p.id, d.day, '09:00:00'::TIME, '19:00:00'::TIME
FROM public.professionals p
CROSS JOIN (SELECT generate_series(1, 6) AS day) d;