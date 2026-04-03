import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  "https://oikniusywvuqcybbmzgg.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9pa25pdXN5d3Z1cWN5YmJtemdnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ5NDY5ODAsImV4cCI6MjA5MDUyMjk4MH0.ni0kY6sFE0vidZ2seVdx4BdKU-_2wpGRvdwRuOWD_ww",
);
