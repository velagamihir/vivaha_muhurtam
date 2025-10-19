import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://hhpjxennvudpraqxzrsf.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhocGp4ZW5udnVkcHJhcXh6cnNmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA4MzIwODksImV4cCI6MjA3NjQwODA4OX0.pZfhIHYqmz5QavdsaKqsWZmLQpaJMz1hggNvEqrJrXw";
export const supabase = createClient(supabaseUrl, supabaseKey);
