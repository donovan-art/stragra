export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      agencies: {
        Row: {
          id: string;
          name: string;
          owner_id: string | null;
          blueprint: Json | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          owner_id?: string | null;
          blueprint?: Json | null;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          owner_id?: string | null;
          blueprint?: Json | null;
          created_at?: string | null;
        };
      };
      agents: {
        Row: {
          id: string;
          agency_id: string;
          name: string;
          division: string;
          agent_type: string | null;
          autonomy_level: number | null;
          is_active: boolean | null;
          config: Json | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          agency_id: string;
          name: string;
          division: string;
          agent_type?: string | null;
          autonomy_level?: number | null;
          is_active?: boolean | null;
          config?: Json | null;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          agency_id?: string;
          name?: string;
          division?: string;
          agent_type?: string | null;
          autonomy_level?: number | null;
          is_active?: boolean | null;
          config?: Json | null;
          created_at?: string | null;
        };
      };
      agent_metrics: {
        Row: {
          id: string;
          agent_id: string;
          metric_type: string;
          value: number;
          recorded_at: string | null;
        };
        Insert: {
          id?: string;
          agent_id: string;
          metric_type: string;
          value: number;
          recorded_at?: string | null;
        };
        Update: {
          id?: string;
          agent_id?: string;
          metric_type?: string;
          value?: number;
          recorded_at?: string | null;
        };
      };
      tasks: {
        Row: {
          id: string;
          agency_id: string;
          agent_id: string | null;
          status: string | null;
          input_data: Json | null;
          output_data: Json | null;
          confidence: number | null;
          created_at: string | null;
          completed_at: string | null;
        };
        Insert: {
          id?: string;
          agency_id: string;
          agent_id?: string | null;
          status?: string | null;
          input_data?: Json | null;
          output_data?: Json | null;
          confidence?: number | null;
          created_at?: string | null;
          completed_at?: string | null;
        };
        Update: {
          id?: string;
          agency_id?: string;
          agent_id?: string | null;
          status?: string | null;
          input_data?: Json | null;
          output_data?: Json | null;
          confidence?: number | null;
          created_at?: string | null;
          completed_at?: string | null;
        };
      };
      escalations: {
        Row: {
          id: string;
          task_id: string | null;
          agent_id: string | null;
          reason: string | null;
          status: string | null;
          resolved_by: string | null;
          created_at: string | null;
          resolved_at: string | null;
        };
        Insert: {
          id?: string;
          task_id?: string | null;
          agent_id?: string | null;
          reason?: string | null;
          status?: string | null;
          resolved_by?: string | null;
          created_at?: string | null;
          resolved_at?: string | null;
        };
        Update: {
          id?: string;
          task_id?: string | null;
          agent_id?: string | null;
          reason?: string | null;
          status?: string | null;
          resolved_by?: string | null;
          created_at?: string | null;
          resolved_at?: string | null;
        };
      };
      todos: {
        Row: {
          id: string;
          agency_id: string;
          text: string;
          priority: string | null;
          is_done: boolean | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          agency_id: string;
          text: string;
          priority?: string | null;
          is_done?: boolean | null;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          agency_id?: string;
          text?: string;
          priority?: string | null;
          is_done?: boolean | null;
          created_at?: string | null;
        };
      };
      quick_links: {
        Row: {
          id: string;
          agency_id: string;
          name: string;
          url: string;
          icon: string | null;
          position: number | null;
        };
        Insert: {
          id?: string;
          agency_id: string;
          name: string;
          url: string;
          icon?: string | null;
          position?: number | null;
        };
        Update: {
          id?: string;
          agency_id?: string;
          name?: string;
          url?: string;
          icon?: string | null;
          position?: number | null;
        };
      };
    };
    Views: {};
    Functions: {};
    Enums: {};
  };
}
