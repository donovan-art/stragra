-- Agencies (from onboarding wizard)
CREATE TABLE agencies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  owner_id UUID REFERENCES auth.users(id),
  blueprint JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Agents
CREATE TABLE agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agency_id UUID REFERENCES agencies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  division TEXT NOT NULL,
  agent_type TEXT DEFAULT 'specialist',
  autonomy_level FLOAT DEFAULT 0.8,
  is_active BOOLEAN DEFAULT true,
  config JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Agent Metrics
CREATE TABLE agent_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID REFERENCES agents(id) ON DELETE CASCADE,
  metric_type TEXT NOT NULL,
  value FLOAT NOT NULL,
  recorded_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tasks
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agency_id UUID REFERENCES agencies(id) ON DELETE CASCADE,
  agent_id UUID REFERENCES agents(id),
  status TEXT DEFAULT 'pending',
  input_data JSONB,
  output_data JSONB,
  confidence FLOAT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- Escalations (Human API queue)
CREATE TABLE escalations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID REFERENCES tasks(id),
  agent_id UUID REFERENCES agents(id),
  reason TEXT,
  status TEXT DEFAULT 'pending',
  resolved_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ
);

-- Todos (dashboard widget)
CREATE TABLE todos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agency_id UUID REFERENCES agencies(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  priority TEXT DEFAULT 'medium',
  is_done BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Quick Links (dashboard widget)
CREATE TABLE quick_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agency_id UUID REFERENCES agencies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  icon TEXT,
  position INT DEFAULT 0
);

-- RLS Policies
ALTER TABLE agencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE escalations ENABLE ROW LEVEL SECURITY;
ALTER TABLE todos ENABLE ROW LEVEL SECURITY;
ALTER TABLE quick_links ENABLE ROW LEVEL SECURITY;

-- Users can only see their own agency data
CREATE POLICY "Users see own agencies" ON agencies FOR ALL USING (owner_id = auth.uid());
CREATE POLICY "Users see own agents" ON agents FOR ALL USING (agency_id IN (SELECT id FROM agencies WHERE owner_id = auth.uid()));
CREATE POLICY "Users see own metrics" ON agent_metrics FOR ALL USING (agent_id IN (
  SELECT a.id FROM agents a JOIN agencies ag ON a.agency_id = ag.id WHERE ag.owner_id = auth.uid()
));
CREATE POLICY "Users see own tasks" ON tasks FOR ALL USING (agency_id IN (SELECT id FROM agencies WHERE owner_id = auth.uid()));
CREATE POLICY "Users see own escalations" ON escalations FOR ALL USING (task_id IN (
  SELECT t.id FROM tasks t JOIN agencies ag ON t.agency_id = ag.id WHERE ag.owner_id = auth.uid()
));
CREATE POLICY "Users see own todos" ON todos FOR ALL USING (agency_id IN (SELECT id FROM agencies WHERE owner_id = auth.uid()));
CREATE POLICY "Users see own quick_links" ON quick_links FOR ALL USING (agency_id IN (SELECT id FROM agencies WHERE owner_id = auth.uid()));
