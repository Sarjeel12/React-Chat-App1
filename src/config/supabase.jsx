import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://xotdhenucldzuwwerunw.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhvdGRoZW51Y2xkenV3d2VydW53Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk1NTEzMzEsImV4cCI6MjA5NTEyNzMzMX0.lXZRiQlT9uaYy3yI4DKrnGK06n1VBzdM8QaaT2RA6iU";
  
export const supabase = createClient(supabaseUrl, supabaseKey);
